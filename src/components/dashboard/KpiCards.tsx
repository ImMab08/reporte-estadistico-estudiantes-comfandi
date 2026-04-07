import { useReportStore, getQualitativeLabel } from "@/store/useReportStore";
import { Users, AlertTriangle, Trophy, TrendingUp } from "lucide-react";

export function KpiCards() {
  const students = useReportStore(state => state.filteredStudents);

  const total = students.length;
  const enRiesgo = students.filter(s => s.estado_academico === "Riesgo").length;
  const excelencia = students.filter(s => s.estado_academico === "Excelencia").length;
  
  const promedioNumeric = total > 0 
    ? (students.reduce((acc, curr) => acc + curr.promedio, 0) / total)
    : 0;

  const desempeñoGlobal = getQualitativeLabel(promedioNumeric);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Estudiantes</p>
          <p className="text-3xl font-black text-slate-800">{total}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Desempeño Global</p>
          <p className={
            `text-3xl font-black ${
              desempeñoGlobal === "Superior" ? "text-green-600" :
              desempeñoGlobal === "Alto" ? "text-blue-600" :
              desempeñoGlobal === "Básico" ? "text-amber-600" : "text-red-600"
            }`
          }>
            {total > 0 ? desempeñoGlobal : "-"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="bg-red-100 p-4 rounded-full text-red-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">En Riesgo Académico</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-red-600">{enRiesgo}</p>
            <span className="text-sm font-medium text-red-400">
              ({total > 0 ? ((enRiesgo / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-green-100 p-5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="bg-green-100 p-4 rounded-full text-green-600">
          <Trophy size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Excelencia</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-green-600">{excelencia}</p>
            <span className="text-sm font-medium text-green-500">
              ({total > 0 ? ((excelencia / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
