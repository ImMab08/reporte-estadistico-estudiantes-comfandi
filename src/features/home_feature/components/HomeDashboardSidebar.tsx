"use client";

import { CustomSelect } from "@/src/components/ui/custom_select";
import {
  IconRefresh,
  IconClose,
  IconCalendarMonth,
  IconFilterAlt,
  IconSchool,
  IconGroup,
} from "@/src/shared/icons";

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
      <aside className="hidden lg:flex w-100 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-col space-y-2 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-primary justify-center space-x-2">
            <IconFilterAlt className="size-6.5" />
            <h1 className="text-2xl font-bold">Filtros</h1>
          </div>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <IconRefresh className="text-primary" />
          </button>
        </div>

        <CustomSelect
          value={selectedId}
          onChange={setSelectedId}
          icon={<IconCalendarMonth className="text-primary size-5" />}
          options={snapshots.map((snapshot) => ({
            value: snapshot.id,
            label: `Periodo ${snapshot.period} · Año ${snapshot.year}`,
          }))}
        />

        <div className="flex w-full space-x-2">
          <CustomSelect
            value={selectedGrade}
            onChange={setSelectedGrade}
            icon={<IconSchool className="text-primary size-5" />}
            options={[
              {
                value: "all",
                label: "Grados",
              },

              ...gradeOptions.map((grade) => ({
                value: grade,
                label: `${grade}°`,
              })),
            ]}
          />

          <CustomSelect
            disabled={selectedGrade === "all"}
            value={selectedGroup}
            onChange={setSelectedGroup}
            icon={<IconGroup className="text-primary size-5" />}
            options={[
              {
                value: "all",
                label: "Grupos",
              },

              ...groupOptions.map((group) => ({
                value: group,
                label: `Grupo ${group}`,
              })),
            ]}
          />
        </div>
      </aside>

      {isMobile && (
        <div
          className={`
            fixed inset-0 z-50 lg:hidden
            flex items-end justify-center
            transition-all duration-300
            ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
          `}
        >
          {/* Overlay */}
          <div
            onClick={onClose}
            className={`
              absolute inset-0  bg-black/40 transition-opacity duration-300
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Drawer */}
          <aside
            className={`
              w-full mx-4
              bg-slate-50 rounded-t-3xl
              px-4 pt-3 pb-16
              shadow-2xl
              transition-all duration-300
              ${isOpen ? "translate-y-0 mb-12" : "translate-y-full mb-0"}
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

            <div className="space-y-2 mb-4">
              <CustomSelect
                direction="up"
                value={selectedId}
                onChange={setSelectedId}
                icon={<IconCalendarMonth className="text-primary size-5" />}
                options={snapshots.map((snapshot) => ({
                  value: snapshot.id,
                  label: `Periodo ${snapshot.period} · Año ${snapshot.year}`,
                }))}
              />

              <div className="flex w-full space-x-2">
                <CustomSelect
                  direction="up"
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                  icon={<IconSchool className="text-primary size-5" />}
                  options={[
                    {
                      value: "all",
                      label: "Grados",
                    },

                    ...gradeOptions.map((grade) => ({
                      value: grade,
                      label: `${grade}°`,
                    })),
                  ]}
                />

                <CustomSelect
                  direction="up"
                  disabled={selectedGrade === "all"}
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                  icon={<IconGroup className="text-primary size-5" />}
                  options={[
                    {
                      value: "all",
                      label: "Grupos",
                    },

                    ...groupOptions.map((group) => ({
                      value: group,
                      label: `Grupo ${group}`,
                    })),
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearFilters}
                className="rounded-xl bg-white border border-slate-200 py-2 text-sm font-medium text-slate-700"
              >
                Limpiar
              </button>

              <button
                onClick={onClose}
                className="rounded-xl bg-primary text-white py-2 text-sm font-semibold"
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
