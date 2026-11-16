"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeaveSummary } from "../api/getLeaveSummary";

export const useGetLeaveSummary = (selectedYear?: number) => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const year = selectedYear ?? currentYear;

  return useQuery({
    queryKey: ["leave-summary", year],
    queryFn: () => {
      if (year === null) {
        throw new Error("Year is not available");
      }

      return getLeaveSummary(year);
    },
    enabled: year !== null,
  });
};
