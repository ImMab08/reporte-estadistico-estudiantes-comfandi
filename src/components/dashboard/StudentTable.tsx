import { useReportStore, getQualitativeLabel } from "@/store/useReportStore";
import { Badge } from "@/components/ui/badge";

export function StudentTable() {
  const students = useReportStore(state => state.filteredStudents);

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Directorio de Estudiantes</h3>
        <span className="text-sm text-slate-500">Mostrando {students.length} resultados</span>
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 font-medium">Código</th>
              <th className="px-6 py-3 font-medium">Nombre</th>
              <th className="px-6 py-3 font-medium">Gráfico</th>
              <th className="px-6 py-3 font-medium">Perdas.</th>
              <th className="px-6 py-3 font-medium">Desempeño</th>
              <th className="px-6 py-3 font-medium text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((student, index) => {
                const label = getQualitativeLabel(student.promedio);
                return (
                  <tr key={`${student.codigo}-${index}`} className="hover:bg-slate-50 transition-colors text-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.codigo}</td>
                    <td className="px-6 py-4 font-medium">{student.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {student.grado} - <span className="font-bold">{student.grupo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          student.cantidad_perdidas > 0 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-50 text-green-600'
                        }`}
                      >
                        {student.cantidad_perdidas}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={
                        label === "Superior" ? "text-green-600" :
                        label === "Alto" ? "text-blue-600" :
                        label === "Básico" ? "text-amber-600" : "text-red-600"
                      }>
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.estado_academico === "Excelencia" && <Badge variant="success">Excelencia</Badge>}
                      {student.estado_academico === "Medio" && <Badge variant="secondary">Rend. Medio</Badge>}
                      {student.estado_academico === "Riesgo" && <Badge variant="destructive">En Riesgo</Badge>}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No hay estudiantes que coincidan con los filtros de búsqueda actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
