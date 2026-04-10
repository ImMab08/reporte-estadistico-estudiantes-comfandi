"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilterUrlState } from "@/src/shared/hooks/useFilterUrlState";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

export function useStudentFilters(snapshots: AcademicPeriodSnapshot[]) {
  //? Constantes
  // Intercepting routes + parallel routes
  const { state, updateState } = useFilterUrlState();

  const [search, setSearch] = useState(state.search);
  const [selectedGrade, setSelectedGrade] = useState(state.grade);
  const [selectedGroup, setSelectedGroup] = useState(state.group);
  const [selectedStudentId, setSelectedStudentId] = useState(state.student);
  const [selectedPeriodId, setSelectedPeriodId] = useState(state.period);

  useEffect(() => {
    if (!selectedPeriodId && snapshots.length > 0) {
      const defaultPeriod = snapshots[0].id;
      setSelectedPeriodId(defaultPeriod);
      updateState({ period: defaultPeriod });
    }
  }, [snapshots, selectedPeriodId, updateState]);

  const activeSnapshot = useMemo(() => {
    return (
      snapshots.find((snapshot) => snapshot.id === selectedPeriodId) ??
      snapshots[0] ??
      null
    );
  }, [snapshots, selectedPeriodId]);

  const handleSearch = (value: string) => {
    setSearch(value);
    updateState({ search: value });
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriodId(value);
    setSelectedStudentId("");

    updateState({
      period: value,
      student: "",
    });
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setSelectedGroup("all");
    setSelectedStudentId("");

    updateState({
      grade: value,
      group: "all",
      student: "",
    });
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedStudentId("");

    updateState({
      group: value,
      student: "",
    });
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    updateState({ student: studentId });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedGrade("all");
    setSelectedGroup("all");
    setSelectedStudentId("");

    updateState({
      search: "",
      grade: "all",
      group: "all",
      student: "",
    });
  };

  const isGroupDisabled = selectedGrade === "all";

  return {
    search,
    selectedGrade,
    selectedGroup,
    selectedStudentId,
    selectedPeriodId,
    activeSnapshot,
    isGroupDisabled,
    handleSearch,
    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    handleStudentSelect,
    clearFilters,
  };
}
