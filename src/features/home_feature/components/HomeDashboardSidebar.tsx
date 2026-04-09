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
}: Props) {
  return (
    <aside className="max-w-100 w-120 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-2">
      <h1 className="text-2xl font-bold text-primary">Filtros</h1>

      <select
        className="rounded-2xl border p-4 cursor-pointer"
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
        className="rounded-2xl border p-4 cursor-pointer"
        value={selectedGrade}
        onChange={(e) => {
          setSelectedGrade(e.target.value);
          setSelectedGroup("all");
        }}
      >
        <option value="all">Todos los grados</option>
        {gradeOptions.map((grade) => (
          <option key={grade} value={grade}>
            {grade}°
          </option>
        ))}
      </select>

      <select
        className="rounded-2xl border p-4 cursor-pointer"
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
