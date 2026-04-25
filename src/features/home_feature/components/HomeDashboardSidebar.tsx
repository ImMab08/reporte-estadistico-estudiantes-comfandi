import { IconRefresh } from "@/src/shared/icons";

type SnapshotOption = {
  id: string;
  period: number;
  year: number;
};

type Props = {
  snapshots: SnapshotOption[];
  selectedId: string;
  setSelectedId: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  gradeOptions: string[];
  groupOptions: string[];
  clearFilters: () => void;
};

export function DashboardSidebar({
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
    <aside className="hidden  max-w-100 w-120 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:flex flex-col space-y-2">
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
  );
}
