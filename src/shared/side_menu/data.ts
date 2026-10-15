import { NavItem } from "@/src/shared/types/type";
import {
  IconBarChart,
  IconHome,
  IconInventoryTwo,
  IconLogout,
  IconMonitoring,
  IconSchool,
  IconSettings,
  IconSocialLeaderboard,
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
    text: "Promoción",
    href: "/promotion",
    icon: IconSocialLeaderboard,
    position: "main",
  },
  {
    text: "Courses",
    href: "/courses",
    icon: IconSocialLeaderboard,
    position: "main",
  },
  {
    text: "Asistencia",
    href: "/attendance",
    icon: IconMonitoring,
    position: "main",
  },
  {
    text: "Reportes",
    href: "#",
    icon: IconBarChart,
    position: "main",
    adminOnly: true,
    children: [
      {
        text: "Asistencia",
        href: "/statistics",
        icon: IconMonitoring,
      },
    ],
  },
  {
    text: "Inventory",
    href: "/inventory",
    icon: IconInventoryTwo,
    position: "main",
  },
  // {
  //   text: "P. Saber",
  //   href: "/resultados-icfes",
  //   icon: IconCognition,
  //   position: "main",
  // },
  // {
  //   text: "Perfil",
  //   href: "/account",
  //   icon: IconAccountCircle,
  //   position: "bottom",
  // },
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
