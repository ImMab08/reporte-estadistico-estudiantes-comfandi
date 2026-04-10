"use client";

import { useCallback } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export function useFilterUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = {
    period: searchParams.get("period") ?? "",
    grade: searchParams.get("grade") ?? "all",
    group: searchParams.get("group") ?? "all",
    student: searchParams.get("student") ?? "",
    search: searchParams.get("search") ?? "",
  };

  const updateState = useCallback(
    (updates: Partial<typeof state>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      const currentUrl = `${pathname}?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.replace(newUrl);
      }
    },
    [pathname, router, searchParams],
  );

  return {
    state,
    updateState,
  };
}