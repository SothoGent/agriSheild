"use client";

import { useCallback, useEffect, useState } from "react";

export type ReviewOutcome = "VERIFIED" | "DISPUTED";

export type Review = {
  policyId: string;
  outcome: ReviewOutcome;
  comment: string;
  reviewer: string;
  timestamp: string;
  snapshot: {
    engineOutcome: string;
    modelScore: number;
    payoutAmount: number;
    triggerThreshold: number;
  };
};

const STORAGE_KEY = "agrishield.reviews.v1";

function readStore(): Record<string, Review> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Review>;
  } catch {
    return {};
  }
}

function writeStore(next: Record<string, Review>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function useReviews() {
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReviews(readStore());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setReviews(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addReview = useCallback((r: Review) => {
    setReviews((prev) => {
      const next = { ...prev, [r.policyId]: r };
      writeStore(next);
      return next;
    });
  }, []);

  const clearReview = useCallback((policyId: string) => {
    setReviews((prev) => {
      const next = { ...prev };
      delete next[policyId];
      writeStore(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setReviews({});
    writeStore({});
  }, []);

  return { reviews, hydrated, addReview, clearReview, clearAll };
}
