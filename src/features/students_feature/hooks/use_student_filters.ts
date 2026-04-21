"use client";

import { useEffect, useMemo } from "react";
import { useFilterUrlState } from "./use_filter_url_state";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

export function useStudentFilters(snapshots: AcademicPeriodSnapshot[]) {
  const { state, updateState } = useFilterUrlState();

  useEffect(() => {
    if (!state.period && snapshots.length > 0) {
      updateState({
        period: snapshots[0].id,
      });
    }
  }, [snapshots, state.period, updateState]);

  const activeSnapshot = useMemo(() => {
    return (
      snapshots.find((snapshot) => snapshot.id === state.period) ??
      snapshots[0] ??
      null
    );
  }, [snapshots, state.period]);

  const handlePeriodChange = (value: string) => {
    updateState({ period: value });
  };

  const handleGradeChange = (value: string) => {
    updateState({
      grade: value,
      group: "all",
    });
  };
  
  const handleGroupChange = (value: string) => {
    updateState({ group: value });
  };

  const clearFilters = () => {
    updateState({
      grade: "all",
      group: "all",
    });
  };

  return {
    selectedPeriodId: state.period,
    selectedGrade: state.grade,
    selectedGroup: state.group,
    activeSnapshot,
    isGroupDisabled: state.grade === "all",

    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    clearFilters,
  };
}
