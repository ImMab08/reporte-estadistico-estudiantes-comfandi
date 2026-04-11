"use client";

import { useEffect, useMemo } from "react";

import { useFilterUrlState } from "@/src/shared/hooks/use_filter_url_state";
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

  const handleSearch = (value: string) => {
    updateState({ search: value });
  };

  const handlePeriodChange = (value: string) => {
    updateState({
      period: value,
      grade: "all",
      group: "all",
      student: "",
    });
  };

  const handleGradeChange = (value: string) => {
    updateState({
      grade: value,
      group: "all",
      student: "",
    });
  };

  const handleGroupChange = (value: string) => {
    updateState({
      group: value,
      student: "",
    });
  };

  const handleStudentSelect = (studentId: string) => {
    updateState({
      student: studentId,
      modal: "",
    });
  };

  const clearFilters = () => {
    updateState({
      search: "",
      grade: "all",
      group: "all",
      student: "",
    });
  };

  return {
    search: state.search,
    selectedGrade: state.grade,
    selectedGroup: state.group,
    selectedStudentId: state.student,
    selectedPeriodId: state.period,
    activeSnapshot,
    isGroupDisabled: state.grade === "all",
    handleSearch,
    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    handleStudentSelect,
    clearFilters,
  };
}
