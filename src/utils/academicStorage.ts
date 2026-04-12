import { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

const KEY = "academic_period_snapshots";

type AcademicStorageMap = Record<string, AcademicPeriodSnapshot>;

export function saveAcademicSnapshot(snapshot: AcademicPeriodSnapshot) {
  const existing = getAcademicSnapshots();

  // reemplaza si ya existe el mismo periodo
  existing[snapshot.id] = snapshot;

  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getAcademicSnapshots(): AcademicStorageMap {
  if (typeof window === "undefined") return {};

  return JSON.parse(localStorage.getItem(KEY) || "{}");
}

export function getAcademicSnapshotById(id: string) {
  const snapshots = getAcademicSnapshots();
  return snapshots[id];
}

export function clearAcademicSnapshots() {
  localStorage.removeItem(KEY);
}

export function deleteAcademicSnapshot(snapshotId: string) {
  const snapshots = getAcademicSnapshots();

  delete snapshots[snapshotId];

  localStorage.setItem(KEY, JSON.stringify(snapshots));
}