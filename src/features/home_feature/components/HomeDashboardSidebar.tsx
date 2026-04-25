"use client";

import { IconRefresh, IconClose } from "@/src/shared/icons";

type SnapshotOption = {
  id: string;
  period: number;
  year: number;
};

type Props = {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;

  snapshots: SnapshotOption[];
  selectedId: string;
  selectedGrade: string;
  selectedGroup: string;

  setSelectedId: (value: string) => void;
  setSelectedGrade: (value: string) => void;
  setSelectedGroup: (value: string) => void;

  gradeOptions: string[];
  groupOptions: string[];

  clearFilters: () => void;
};

export function DashboardSidebar({
  isMobile = false,
  isOpen = false,
  onClose,

  snapshots,
  selectedId,
  setSelectedId,
  selectedGrade,
  setSelectedGrade,
  selectedGroup,
  setSelectedGroup,
  gradeOptions,
  groupOptions,
  clearFilters,
}: Props) {
  return (
    <>
      <aside className="hidden md:flex max-w-100 w-120 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-col space-y-2 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary">Filtros</h1>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <IconRefresh className="text-primary" />
          </button>
        </div>

        <select
          className="rounded-xl w-full border border-slate-200 p-2 cursor-pointer"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {snapshots.map((snapshot) => (
            <option key={snapshot.id} value={snapshot.id}>
              Periodo {snapshot.period} · Año {snapshot.year}
            </option>
          ))}
        </select>

        <select
          className="rounded-xl w-full border border-slate-200 p-2 cursor-pointer"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="all">Todos los grados</option>

          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>
              {grade}°
            </option>
          ))}
        </select>

        <select
          disabled={selectedGrade === "all"}
          className="
            rounded-xl w-full border border-slate-200 p-2
            cursor-pointer
            disabled:bg-slate-100
            disabled:text-slate-400
            disabled:cursor-not-allowed
          "
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="all">Todos los grupos</option>

          {groupOptions.map((group) => (
            <option key={group} value={group}>
              Grupo {group}
            </option>
          ))}
        </select>
      </aside>

      {isMobile && (
        <div
          className={`
            fixed inset-0 z-50 md:hidden transition-all duration-300
            ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
          `}
        >
          {/* Overlay */}
          <div
            onClick={onClose}
            className={`
              absolute inset-0 bg-black/40 transition-opacity duration-300
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Drawer */}
          <aside
            className={`
              absolute bottom-0 left-0 right-0
              bg-white rounded-t-3xl
              px-4 pt-3 pb-28
              shadow-2xl
              transition-transform duration-300
              ${isOpen ? "translate-y-0" : "translate-y-full"}
            `}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-primary">Filtros</h1>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <IconClose className="text-primary size-5" />
              </button>
            </div>

            <select
              className="rounded-xl w-full border border-slate-200 p-3 mb-3 cursor-pointer"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {snapshots.map((snapshot) => (
                <option key={snapshot.id} value={snapshot.id}>
                  Periodo {snapshot.period} · Año {snapshot.year}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl w-full border border-slate-200 p-3 mb-3 cursor-pointer"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="all">Todos los grados</option>

              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}°
                </option>
              ))}
            </select>

            <select
              disabled={selectedGrade === "all"}
              className="
                rounded-xl w-full border border-slate-200 p-3 mb-4
                cursor-pointer
                disabled:bg-slate-100
                disabled:text-slate-400
                disabled:cursor-not-allowed
              "
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="all">Todos los grupos</option>

              {groupOptions.map((group) => (
                <option key={group} value={group}>
                  Grupo {group}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 py-3 font-medium text-slate-700"
              >
                Limpiar
              </button>

              <button
                onClick={onClose}
                className="rounded-xl bg-primary text-white py-3 font-semibold"
              >
                Aplicar
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}