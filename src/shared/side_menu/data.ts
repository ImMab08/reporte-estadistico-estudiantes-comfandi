import { NavItem } from "@/src/shared/types/type";
import {
  IconAccountCircle,
  IconCognition,
  IconHome,
  IconLogout,
  IconSchool,
  IconSettings,
} from "@/src/shared/icons";

export const navItems: NavItem[] = [
  {
    text: "Inicio",
    href: "/",
    icon: IconHome,
    position: "main",
  },
  {
    text: "Estudiantes",
    href: "/students",
    icon: IconSchool,
    position: "main",
  },
  {
    text:  "ICFES",
    href: "/resultados-icfes",
    icon: IconCognition,
    position: "main",
  },
  {
    text: "Perfil",
    href: "/account",
    icon: IconAccountCircle,
    position: "bottom",
  },
  {
    text: "Configuración",
    href: "/settings",
    icon: IconSettings,
    position: "bottom",
  },
  {
    text: "Cerrar sesión",
    href: "/auth",
    icon: IconLogout,
    position: "bottom",
  },
];
