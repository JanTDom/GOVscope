"""Asynchronous ingestion engine with tenacity backoff, rate limiting, and robust error handling."""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

logger = logging.getLogger("govscope.ingest.engine")


class RateLimiter:
    """Domain-aware asynchronous rate limiter."""

    def __init__(self, requests_per_second: float = 2.0) -> None:
        self.interval = 1.0 / max(requests_per_second, 0.1)
        self._last_call_per_domain: Dict[str, float] = {}
        self._lock = asyncio.Lock()

    async def throttle(self, url: str) -> None:
        domain = urlparse(url).netloc or "default"
        async with self._lock:
            now = time.monotonic()
            last_call = self._last_call_per_domain.get(domain, 0.0)
            elapsed = now - last_call
            if elapsed < self.interval:
                delay = self.interval - elapsed
                await asyncio.sleep(delay)
            self._last_call_per_domain[domain] = time.monotonic()


class AsyncIngestEngine:
    """Production-grade asynchronous ingestion engine for Polish government portals and feeds."""

    DEFAULT_USER_AGENT = "GOVscope-Intelligence-Crawler/1.0 (+https://govscope.gov.pl/bot; KPRM Monitoring)"

    def __init__(
        self,
        timeout: float = 12.0,
        max_retries: int = 4,
        requests_per_second: float = 3.0,
        custom_headers: Optional[Dict[str, str]] = None,
    ) -> None:
        self.timeout = timeout
        self.max_retries = max_retries
        self.rate_limiter = RateLimiter(requests_per_second=requests_per_second)
        headers = {
            "User-Agent": self.DEFAULT_USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
        }
        if custom_headers:
            headers.update(custom_headers)
        self.headers = headers
        self._client: Optional[httpx.AsyncClient] = None

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(self.timeout),
                headers=self.headers,
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    async def fetch(self, url: str, extra_headers: Optional[Dict[str, str]] = None) -> Optional[str]:
        """Fetch URL content with exponential backoff and rate-limiting."""
        await self.rate_limiter.throttle(url)
        client = await self.get_client()

        retrying = AsyncRetrying(
            stop=stop_after_attempt(self.max_retries),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type((httpx.RequestError, httpx.TimeoutException)),
            reraise=False,
        )

        try:
            async for attempt in retrying:
                with attempt:
                    response = await client.get(url, headers=extra_headers)
                    if response.status_code == 200:
                        return response.text
                    elif response.status_code == 429:
                        retry_after_hdr = response.headers.get("Retry-After")
                        delay = float(retry_after_hdr) if retry_after_hdr and retry_after_hdr.isdigit() else 2.0
                        logger.warning("Rate-limited (429) for %s. Backing off for %.1fs", url, delay)
                        await asyncio.sleep(delay)
                        raise httpx.RequestError(f"Rate limited 429 on {url}", request=response.request)
                    elif 500 <= response.status_code < 600:
                        logger.warning("Server error %d on %s, retrying...", response.status_code, url)
                        raise httpx.RequestError(f"Server error {response.status_code}", request=response.request)
                    else:
                        logger.error("HTTP %d for URL: %s", response.status_code, url)
                        return None
        except Exception as exc:
            logger.error("Failed fetching %s after retries: %s", url, exc)
            return None

        return None

    async def fetch_json(self, url: str, extra_headers: Optional[Dict[str, str]] = None) -> Optional[Any]:
        """Fetch JSON endpoint with parsed dictionary/list response."""
        text = await self.fetch(url, extra_headers)
        if text is None:
            return None
        try:
            import json
            return json.loads(text)
        except Exception as json_err:
            logger.error("Failed to parse JSON from %s: %s", url, json_err)
            return None
