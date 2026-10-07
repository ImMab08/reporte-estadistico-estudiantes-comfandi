export type Role =
  | "admin"
  | "docente"
  | "administrador"
  | "administradora"
  | "administrativo"
  | "coordinadora"
  | "coordinador"
  | "rector"
  | "psicologa";

export type Nivel =
  | "preescolar"
  | "primaria"
  | "secundaria"
  | "consejo"
  | "todos";

export interface User {
  email: string;
  name?: string;
  role: Role;
  niveles: Nivel[];
}