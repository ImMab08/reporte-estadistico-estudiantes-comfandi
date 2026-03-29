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
    href: "/estudiantes",
    icon: IconSchool,
    position: "main"
  },
  {
    text: "Cónfiguración",
    href: "/configuracion",
    icon: IconSettings,
    position: "bottom"
  },
];
