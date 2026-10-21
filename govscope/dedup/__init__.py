"""Deduplication utilities."""

from govscope.dedup.minhash import MinHash, MinHashLSHIndex, shingle

__all__ = ["MinHash", "MinHashLSHIndex", "shingle"]
