import { useReportStore } from "@/store/useReportStore";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";
import { useMemo } from "react";

export function SidebarFilters() {
  const { students, filters, setFilters, clearFilters, role, assignedGroup } = useReportStore();

  const grados = useMemo(() => Array.from(new Set(students.map(s => s.grado))).sort(), [students]);
  const gruposAdmin = useMemo(() => Array.from(new Set(students.map(s => s.grupo))).sort(), [students]);
  const grupos = role === "Docente" ? [assignedGroup] : gruposAdmin;
  const periodos = useMemo(() => Array.from(new Set(students.map(s => s.periodo))).sort((a,b)=>a-b), [students]);

  const materias = useMemo(() => {
    if (students.length === 0) return [];
    return Array.from(new Set(students[0].materias.map(m => m.name))).sort();
  }, [students]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Search size={18} className="text-blue-600" />
          Filtros y Búsqueda
        </h3>
        <div className="relative">
          <Input 
            placeholder="Buscar por nombre o código..." 
            value={filters.searchQuery || ""}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
      </div>

      <div className="space-y-4">
        {periodos.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Periodo</label>
            <Select 
              value={filters.periodo || ""} 
              onChange={(e) => setFilters({ periodo: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Todos los periodos</option>
              {periodos.map(p => <option key={p} value={p}>Periodo {p}</option>)}
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grado</label>
          <Select 
            value={filters.grado || ""} 
            onChange={(e) => setFilters({ grado: e.target.value || undefined })}
          >
            <option value="">Todos los grados</option>
            {grados.map(g => <option key={g} value={g}>{g}</option>)}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grupo</label>
          <Select 
            value={filters.grupo || ""} 
            onChange={(e) => setFilters({ grupo: e.target.value || undefined })}
            disabled={role === "Docente"}
          >
            {role === "Admin" && <option value="">Todos los grupos</option>}
            {grupos.map(g => <option key={g} value={g}>{g}</option>)}
          </Select>
          {role === "Docente" && <p className="text-[10px] text-amber-600 font-medium">Restringido a tu grupo asignado ({assignedGroup})</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Materia</label>
          <Select 
            value={filters.materia || ""} 
            onChange={(e) => setFilters({ materia: e.target.value || undefined })}
          >
            <option value="">Todas las materias</option>
            {materias.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado Académico</label>
          <Select 
            value={filters.estado_academico || ""} 
            onChange={(e) => setFilters({ estado_academico: e.target.value || undefined })}
          >
            <option value="">Todos los estados</option>
            <option value="Excelencia">🏆 Excelencia Académica</option>
            <option value="Medio">📊 Rendimiento Medio</option>
            <option value="Riesgo">⚠️ En Riesgo (Perdidas)</option>
          </Select>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full text-slate-700 font-medium border-slate-300 hover:bg-slate-100"
        onClick={clearFilters}
      >
        <FilterX size={16} className="mr-2" />
        Limpiar Filtros
      </Button>
    </div>
  );
}
