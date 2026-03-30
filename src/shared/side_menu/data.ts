import { NavItem } from "@/src/shared/types/type";
import { IconHome, IconSchool, IconSettings } from "@/src/shared/icons";

export const navItems: NavItem[] = [
  {
    text: "Inicio",
    href: "/",
    icon: IconHome,
    position: "main"
  },
  {
    text: "Estudiantes",
    href: "/students",
    icon: IconSchool,
    position: "main"
  },
  {
    text: "Configuración",
    href: "/settings",
    icon: IconSettings,
    position: "bottom"
  },
];
