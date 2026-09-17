"use client";

import { useEffect, useMemo, useState } from "react";

import { IcfesDataset, IcfesStudent } from "@/src/shared/types/icfes.types";

import { getIcfesDatasets, hasIcfesData } from "@/src/utils/icfes/icfesStorage";

export function useIcfesController() {
  // estados
  const [datasets, setDatasets] = useState<Record<string, IcfesDataset>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // loading
  useEffect(() => {
    try {
      const storageDatasets = getIcfesDatasets();

      setDatasets(storageDatasets);

      const years = Object.values(storageDatasets)
        .map((dataset) => dataset.year)
        .sort((a, b) => b - a);

      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error("[ICFES_CONTROLLER_LOAD_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // has data
  const hasData = useMemo(() => {
    return hasIcfesData();
  }, []);

  // Años
  const availableYears = useMemo(() => {
    return Object.values(datasets)
      .map((dataset) => dataset.year)
      .sort((a, b) => b - a);
  }, [datasets]);

  // Activar dataset
  const dataset = useMemo<IcfesDataset | null>(() => {
    return (
      Object.values(datasets).find(
        (dataset) => dataset.year === selectedYear,
      ) ?? null
    );
  }, [datasets, selectedYear]);

  // Estudiantes
  const students = useMemo(() => {
    return dataset?.students ?? [];
  }, [dataset]);

  // filtro de estudiantes
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());

      const matchesGroup =
        selectedGroup === "all" ? true : student.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [students, search, selectedGroup]);

  // seleccionar estudiante
  const selectedStudent = useMemo<IcfesStudent | null>(() => {
    if (!selectedStudentId) {
      return null;
    }

    return students.find((student) => student.id === selectedStudentId) ?? null;
  }, [students, selectedStudentId]);

  // grupos
  const groups = useMemo(() => {
    return [...new Set(students.map((student) => student.group))];
  }, [students]);

  // Acciones
  function handleSelectStudent(studentId: string) {
    setSelectedStudentId(studentId);
  }

  function clearSelectedStudent() {
    setSelectedStudentId(null);
  }

  function clearFilters() {
    setSearch("");
    setSelectedGroup("all");
  }

  return {
    /* estados */
    loading,
    hasData,

    /* datasets */
    datasets,
    dataset,

    availableYears,
    selectedYear,
    setSelectedYear,

    /* estudiantes */
    students,
    filteredStudents,
    selectedStudent,

    /* filtros */
    search,
    setSearch,

    selectedGroup,
    setSelectedGroup,

    groups,

    /* analytics */
    analytics: dataset?.analytics ?? null,
    groupsAnalytics: dataset?.groupsAnalytics ?? [],
    topStudents: dataset?.topStudents ?? [],
    lowestStudents: dataset?.lowestStudents ?? [],
    comparisons: dataset?.comparisons ?? [],
    scoreDistribution: dataset?.scoreDistribution ?? [],

    /* Actions */
    handleSelectStudent,
    clearSelectedStudent,
    clearFilters,
  };
}
