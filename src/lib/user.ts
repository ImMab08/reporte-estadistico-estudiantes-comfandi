export type Role =
  | "docente"
  | "coordinadora"
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
  password: string;
  role: Role;
  niveles: Nivel[];
}