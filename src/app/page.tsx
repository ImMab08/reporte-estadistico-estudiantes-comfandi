"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseExcel } from "@/lib/excelProcessor";
import { useReportStore } from "@/store/useReportStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UploadCloud, BookOpen } from "lucide-react";
import { Role } from "@/types";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRoleState] = useState<Role>("Admin");
  const [docenteGroup, setDocenteGroup] = useState("");
  
  const { setStudents, setRole, setAssignedGroup, clearData } = useReportStore();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".csv"))) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Por favor sube un archivo Excel válido (.xlsx o .csv)");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    if (role === "Docente" && !docenteGroup.trim()) {
      setError("Los docentes deben especificar su grupo asignado (Ej: 6A).");
      return;
    }
    
    setLoading(true);
    try {
      clearData();
      const students = await parseExcel(file);
      setStudents(students);
      setRole(role);
      setAssignedGroup(docenteGroup.toUpperCase().trim());
      router.push("/dashboard");
    } catch (err) {
      setError("Error al procesar el archivo. Verifica que tenga la estructura correcta.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 text-blue-600">
            <BookOpen size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">
            Analítica Comfandi
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2">
            Sube el archivo Excel de rendimiento de estudiantes para visualizar el dashboard.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors bg-white hover:border-blue-400"
            >
              <Input 
                id="file-upload" 
                type="file" 
                accept=".xlsx,.csv" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                <UploadCloud size={40} className="text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">
                  {file ? file.name : "Haz clic o arrastra un archivo Excel aquí"}
                </span>
              </label>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5 focus-within:text-blue-600">
                <label className="text-sm font-medium">Rol de usuario</label>
                <Select 
                  value={role} 
                  onChange={(e) => setRoleState(e.target.value as Role)}
                >
                  <option value="Admin">Administrador (Todos los grupos)</option>
                  <option value="Docente">Docente Titular (Un grupo)</option>
                </Select>
              </div>

              {role === "Docente" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Grupo Asignado</label>
                  <Input 
                    placeholder="Ejemplo: 7A o 7°A" 
                    value={docenteGroup}
                    onChange={(e) => setDocenteGroup(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <Button 
            className="w-full text-md py-6 rounded-lg font-bold" 
            onClick={handleProcess} 
            disabled={!file || loading}
          >
            {loading ? "Procesando..." : "Ingresar al Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
