import { create } from 'zustand';
import { Student, FilterOptions, Role } from '../types';

interface ReportState {
  students: Student[];
  filteredStudents: Student[];
  filters: FilterOptions;
  role: Role;
  assignedGroup: string;
  setStudents: (students: Student[]) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setRole: (role: Role) => void;
  setAssignedGroup: (group: string) => void;
  clearFilters: () => void;
  clearData: () => void;
}

const filterStudents = (students: Student[], filters: FilterOptions, role: Role, assignedGroup: string): Student[] => {
  return students.filter(student => {
    // Role-based filtering
    if (role === "Docente" && assignedGroup && student.grupo !== assignedGroup) {
      return false;
    }

    // Dynamic filters
    if (filters.periodo && student.periodo !== filters.periodo) return false;
    if (filters.grado && student.grado !== filters.grado) return false;
    if (filters.grupo && student.grupo !== filters.grupo) return false;
    if (filters.estado_academico && student.estado_academico !== filters.estado_academico) return false;
    
    if (filters.materia) {
      const hasSubject = student.materias.some(m => m.name === filters.materia);
      if (!hasSubject) return false;
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!student.nombre.toLowerCase().includes(query) && !student.codigo.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true;
  });
};

export const useReportStore = create<ReportState>((set, get) => ({
  students: [],
  filteredStudents: [],
  filters: {},
  role: "Admin",
  assignedGroup: "",
  
  setStudents: (students) => set((state) => {
    const filtered = filterStudents(students, state.filters, state.role, state.assignedGroup);
    return { students, filteredStudents: filtered };
  }),
  
  setFilters: (newFilters) => set((state) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    const filtered = filterStudents(state.students, updatedFilters, state.role, state.assignedGroup);
    return { filters: updatedFilters, filteredStudents: filtered };
  }),
  
  setRole: (role) => set((state) => {
    const filtered = filterStudents(state.students, state.filters, role, state.assignedGroup);
    return { role, filteredStudents: filtered };
  }),
  
  setAssignedGroup: (assignedGroup) => set((state) => {
    const filtered = filterStudents(state.students, state.filters, state.role, assignedGroup);
    return { assignedGroup, filteredStudents: filtered };
  }),

  clearFilters: () => set((state) => {
    const filtered = filterStudents(state.students, {}, state.role, state.assignedGroup);
    return { filters: {}, filteredStudents: filtered };
  }),
  
  clearData: () => set({ students: [], filteredStudents: [], filters: {} }),
}));

export const getQualitativeLabel = (average: number): string => {
  if (average >= 4.5) return "Superior";
  if (average >= 4.0) return "Alto";
  if (average >= 3.0) return "Básico";
  return "Bajo";
};


