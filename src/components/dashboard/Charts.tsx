import { useReportStore } from "@/store/useReportStore";
import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#64748b', '#ef4444']; // Excelencia (green), Medio (slate), Riesgo (red)

export function Charts() {
  const students = useReportStore(state => state.filteredStudents);

  const stateData = useMemo(() => {
    let exc = 0; let med = 0; let ri = 0;
    students.forEach(s => {
      if(s.estado_academico === "Excelencia") exc++;
      else if(s.estado_academico === "Medio") med++;
      else if(s.estado_academico === "Riesgo") ri++;
    });
    return [
      { name: "Excelencia", value: exc },
      { name: "Medio", value: med },
      { name: "Riesgo", value: ri }
    ];
  }, [students]);

  const subjectRiskData = useMemo(() => {
    const riskMap: Record<string, number> = {};
    students.forEach(s => {
      s.materias.forEach(m => {
        if(m.grade === "Bajo") {
          riskMap[m.name] = (riskMap[m.name] || 0) + 1;
        }
      });
    });
    
    return Object.entries(riskMap)
      .map(([name, count]) => ({ name, 'Perdidas': count }))
      .sort((a, b) => b.Perdidas - a.Perdidas)
      .slice(0, 10); // top 10 worst
  }, [students]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Distribución de Rendimiento</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Top 10 Materias con Mayor Índice de Pérdida</h3>
        <div className="h-72 mt-4">
          {subjectRiskData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="Perdidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No hay materias perdidas registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
