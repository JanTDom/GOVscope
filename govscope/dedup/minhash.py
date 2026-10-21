"""MinHash LSH for deduplicating press agency wires and news articles."""

from __future__ import annotations

import hashlib
import re
from typing import Dict, Iterable, List, Set


def _tokenize(text: str) -> List[str]:
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return [token for token in cleaned.split() if token]


def shingle(text: str, k: int = 3) -> Set[str]:
    tokens = _tokenize(text)
    if len(tokens) < k:
        return {" ".join(tokens)} if tokens else set()
    return {" ".join(tokens[i : i + k]) for i in range(len(tokens) - k + 1)}


class MinHash:
    def __init__(self, num_perm: int = 64, seed: int = 42) -> None:
        self.num_perm = num_perm
        self.seed = seed
        self._max_hash = (1 << 32) - 1

    def compute_signature(self, shingles: Iterable[str]) -> List[int]:
        shingle_list = list(shingles)
        if not shingle_list:
            return [0] * self.num_perm

        signature: List[int] = [self._max_hash] * self.num_perm
        for s in shingle_list:
            s_bytes = s.encode("utf-8")
            for i in range(self.num_perm):
                salt = f"{self.seed}:{i}:".encode("utf-8")
                h = int(hashlib.md5(salt + s_bytes).hexdigest()[:8], 16)
                if h < signature[i]:
                    signature[i] = h
        return signature

    @staticmethod
    def jaccard_similarity(sig_a: List[int], sig_b: List[int]) -> float:
        if not sig_a or not sig_b or len(sig_a) != len(sig_b):
            return 0.0
        matches = sum(1 for a, b in zip(sig_a, sig_b) if a == b)
        return matches / float(len(sig_a))


class MinHashLSHIndex:
    def __init__(self, num_perm: int = 64, bands: int = 8, threshold: float = 0.75) -> None:
        if num_perm % bands != 0:
            raise ValueError("num_perm must be divisible by bands")
        self.num_perm = num_perm
        self.bands = bands
        self.rows_per_band = num_perm // bands
        self.threshold = threshold
        self.buckets: Dict[str, Set[str]] = {}
        self.signatures: Dict[str, List[int]] = {}

    def insert(self, key: str, signature: List[int]) -> None:
        self.signatures[key] = signature
        for b in range(self.bands):
            start = b * self.rows_per_band
            end = start + self.rows_per_band
            band_chunk = tuple(signature[start:end])
            bucket_key = f"{b}:{band_chunk}"
            if bucket_key not in self.buckets:
                self.buckets[bucket_key] = set()
            self.buckets[bucket_key].add(key)

    def query(self, signature: List[int]) -> List[str]:
        candidates: Set[str] = set()
        for b in range(self.bands):
            start = b * self.rows_per_band
            end = start + self.rows_per_band
            band_chunk = tuple(signature[start:end])
            bucket_key = f"{b}:{band_chunk}"
            if bucket_key in self.buckets:
                candidates.update(self.buckets[bucket_key])

        results: List[str] = []
        for candidate_key in candidates:
            cand_sig = self.signatures[candidate_key]
            sim = MinHash.jaccard_similarity(signature, cand_sig)
            if sim >= self.threshold:
                results.append(candidate_key)
        return results
