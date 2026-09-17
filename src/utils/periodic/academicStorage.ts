import { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

const KEY = "academic_period_snapshots";

type AcademicStorageMap = Record<string, AcademicPeriodSnapshot>;

function canUseStorage() {
  return typeof window !== "undefined";
}

export function saveAcademicSnapshot(snapshot: AcademicPeriodSnapshot) {
  if (!canUseStorage()) return;

  const existing = getAcademicSnapshots();
  existing[snapshot.id] = snapshot;

  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getAcademicSnapshots(): AcademicStorageMap {
  if (!canUseStorage()) return {};

  return JSON.parse(localStorage.getItem(KEY) || "{}");
}

export function getAcademicSnapshotById(id: string) {
  const snapshots = getAcademicSnapshots();
  return snapshots[id];
}

export function clearAcademicSnapshots() {
  if (!canUseStorage()) return;

  localStorage.removeItem(KEY);
}

export function deleteAcademicSnapshot(snapshotId: string) {
  if (!canUseStorage()) return;

  const snapshots = getAcademicSnapshots();

  delete snapshots[snapshotId];

  localStorage.setItem(KEY, JSON.stringify(snapshots));
}