"""Semantic vector similarity and thematic matching engine."""

from __future__ import annotations

import math
from typing import List, Tuple
from uuid import UUID


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Computes cosine similarity between two high-dimensional embedding vectors."""
    if len(v1) != len(v2) or not v1:
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


class SemanticVectorIndex:
    """In-memory vector store matching pgvector HNSW indexing semantics."""

    def __init__(self, similarity_threshold: float = 0.75) -> None:
        self.similarity_threshold = similarity_threshold
        self._entries: List[Tuple[UUID, str, List[float]]] = []

    def add(self, statement_id: UUID, topic: str, embedding: List[float]) -> None:
        self._entries.append((statement_id, topic, embedding))

    def search_similar(
        self,
        query_embedding: List[float],
        top_k: int = 5,
    ) -> List[Tuple[UUID, str, float]]:
        """Finds top-k nearest statements based on cosine similarity."""
        scored = []
        for stmt_id, topic, emb in self._entries:
            score = cosine_similarity(query_embedding, emb)
            if score >= self.similarity_threshold:
                scored.append((stmt_id, topic, score))
        scored.sort(key=lambda x: x[2], reverse=True)
        return scored[:top_k]
