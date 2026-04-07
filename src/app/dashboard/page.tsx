"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReportStore } from "@/store/useReportStore";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { Charts } from "@/components/dashboard/Charts";
import { StudentTable } from "@/components/dashboard/StudentTable";
import { SidebarFilters } from "@/components/dashboard/SidebarFilters";
import { Button } from "@/components/ui/button";
import { LogOut, Presentation, FileDown, Printer } from "lucide-react";
import * as xlsx from 'xlsx';

export default function Dashboard() {
  const router = useRouter();
  const { students, filteredStudents, role, assignedGroup } = useReportStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (students.length === 0) {
      router.push("/");
    }
  }, [students, router]);

  const handleExport = () => {
    const filtered = filteredStudents;
    if(filtered.length === 0) return alert("No hay datos para exportar");

    const exportData = filtered.map(s => ({
      Codigo: s.codigo,
      Nombre: s.nombre,
      Periodo: s.periodo,
      Grado: s.grado,
      Grupo: s.grupo,
      Promedio: s.promedio,
      Materias_Perdidas: s.cantidad_perdidas,
      Estado: s.estado_academico,
    }));

    const ws = xlsx.utils.json_to_sheet(exportData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Reporte_Filtrado");
    xlsx.writeFile(wb, "Reporte_Estudiantes_Comfandi.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted || students.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 print:bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
            <Presentation size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Comfandi Analytics</h1>
          <span className="hidden md:inline-flex ml-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
            Sesión: {role} {assignedGroup && `(Grupo ${assignedGroup})`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex text-slate-600 border-slate-300">
            <FileDown size={16} className="mr-2" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:flex text-slate-600 border-slate-300">
            <Printer size={16} className="mr-2" />
            PDF / Imprimir
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} title="Salir y cargar nuevo archivo" className="text-slate-500 hover:bg-slate-100">
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        {/* Titulo para cuando se imprime */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-4xl font-bold text-black">Reporte Oficial de Rendimiento - Comfandi</h1>
          <p className="text-slate-600 mt-2 font-medium">Generado el: {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()} - Criterios Aplicados: Activos en la vista.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de filtros */}
          <aside className="w-full lg:w-[280px] xl:w-72 shrink-0 print:hidden">
            <div className="sticky top-[88px]">
              <SidebarFilters />
            </div>
          </aside>

          {/* Gráficos y Tablas */}
          <main className="flex-1 space-y-6 min-w-0">
            <KpiCards />
            <Charts />
            <StudentTable />
          </main>
        </div>
      </div>
    </div>
  );
}
