"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { navItems } from "./data";
import { canViewAttendanceStatistics } from "@/src/lib/attendance_statistics_access";
import type { SessionUser } from "@/src/lib/session";
import { logout } from "@/src/app/auth/actions";
import { IconKeyboardArrowDown } from "@/src/shared/icons";

export function DesktopMenu({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  const [openGroup, setOpenGroup] = useState(
    () =>
      navItems.find((item) =>
        item.children?.some((child) => child.href === currentPath),
      )?.text ?? null,
  );

  if (
    pathname?.startsWith("/auth") ||
    pathname === "/attendance"
  ) {
    return null;
  }

  const handleLogout = async () => {
    sessionStorage.removeItem("app_initialized");
    sessionStorage.removeItem("just_logged_in");
    await logout();
  };

  const renderMenuItem = (item: (typeof navItems)[number]) => {
    const Icon = item.icon;
    const isActive = item.children
      ? item.children.some((child) => currentPath === child.href)
      : currentPath === item.href;
    const isLogout = item.text === "Cerrar sesión";

    if (item.children) {
      return (
        <div key={item.text}>
          <button
            type="button"
            aria-expanded={openGroup === item.text}
            aria-controls="reports-submenu"
            onClick={() =>
              setOpenGroup((current) =>
                current === item.text ? null : item.text,
              )
            }
            className="flex w-full cursor-pointer items-stretch space-x-2 text-left group"
          >
            <div
              className={`w-1 rounded-full bg-primary origin-left transition-transform duration-300 ${isActive || openGroup === item.text
                  ? "scale-y-100"
                  : "scale-y-0 group-hover:scale-y-100"
                }`}
            />
            <div
              className={`relative flex w-full items-center space-x-2 rounded-lg px-2 py-1 transition-all duration-300 ${isActive || openGroup === item.text
                  ? "left-0 bg-primary text-white"
                  : "-left-3 bg-white text-primary group-hover:left-0 group-hover:bg-primary group-hover:text-white"
                }`}
            >
              <Icon width={20} height={20} />
              <span className="font-semibold">{item.text}</span>
              <IconKeyboardArrowDown
                className={`ml-auto size-4 transition-transform ${openGroup === item.text ? "rotate-180" : ""
                  }`}
              />
            </div>
          </button>
          {openGroup === item.text && (
            <div
              id="reports-submenu"
              className="ml-4 mt-10 space-y-1 border-l border-primary/15 pl-2"
            >
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const childIsActive = pathname === child.href;

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition ${childIsActive
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-primary/10"
                      }`}
                  >
                    <ChildIcon width={18} height={18} />
                    <span>{child.text}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const content = (
      <>
        <div
          className={`w-1 ${isLogout ? "bg-red-500" : "bg-primary"} rounded-full origin-left transition-transform duration-300 ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
            }`}
        />

        <div
          className={`flex relative items-center space-x-2 w-full py-1 px-2 rounded-lg transition-all duration-300 ${isActive
              ? isLogout
                ? "bg-red-500 text-white"
                : "bg-primary text-white"
              : isLogout
                ? "text-red-500 bg-white group-hover:bg-red-500 group-hover:text-white -left-3 group-hover:left-0"
                : "text-primary bg-white group-hover:bg-primary group-hover:text-white -left-3 group-hover:left-0"
            }`}
        >
          <Icon width={20} height={20} />
          <p className="font-semibold">{item.text}</p>
        </div>
      </>
    );

    // cerrar sesión
    if (isLogout) {
      return (
        <button
          key={item.text}
          onClick={handleLogout}
          className="flex space-x-2 items-stretch group w-full text-left cursor-pointer"
        >
          {content}
        </button>
      );
    }

    // links normales
    if (item.href === "/students") {
      return (
        <a
          key={item.text}
          href={item.href}
          className="flex space-x-2 items-stretch group"
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.text}
        href={item.href}
        className="flex space-x-2 items-stretch group"
      >
        {content}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:block max-w-50 w-full h-screen bg-white">
      <div className="h-full p-4 flex flex-col">
        {/* Logo */}
        <div className="flex w-full justify-center pb-4 border-b-2 border-primary/10">
          <Image
            alt=""
            width={90}
            height={90}
            className="object-contain"
            src="/img/logo/logo_edumetrics.svg"
          />
        </div>

        <div className="flex flex-col flex-1 mt-5">
          {/* Parte superior */}
          <div className="space-y-2">
            {navItems
              .filter(
                (item) =>
                  item.position !== "bottom" &&
                  (!item.adminOnly ||
                    canViewAttendanceStatistics(user?.role)),
              )
              .map(renderMenuItem)}
          </div>

          {/* Parte inferior */}
          <div className="mt-auto space-y-2">
            {navItems
              .filter(
                (item) =>
                  (item.position === "bottom" || item.text === "Cerrar sesión") &&
                  (!item.adminOnly ||
                    canViewAttendanceStatistics(user?.role)),
              )
              .map(renderMenuItem)}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col space-y-2 p-2 pt-4 border-t-2 border-primary/10 rounded-lg text-primary">
          <div className="flex flex-col items-center space-x-2 text-xs text-center space-y-1">
            <div>
              <p className="font-semibold">Comfandi</p>
              <p className="font-semibold">Campus E Yumbo</p>
            </div>
            <p>Todos los derechos reservados.</p>
            <p>© 2026 Edumetricks</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
