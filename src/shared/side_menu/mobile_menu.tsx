"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { navItems } from "./data";
import { canViewAttendanceStatistics } from "@/src/lib/attendance_statistics_access";
import type { SessionUser } from "@/src/lib/session";
import { logout } from "@/src/app/auth/actions";

export function MobileMenu({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  if (
    !user ||
    pathname === "/attendance"
  ) {
    return null;
  }

  const handleLogout = async () => {
    sessionStorage.removeItem("app_initialized");
    sessionStorage.removeItem("just_logged_in");
    await logout();
  };

  return (
    <aside className="w-full lg:hidden z-50 px-4 py-2 ">
      <div className="relative h-18 flex items-center justify-center">
        <div className="absolute bottom-0 w-full h-full bg-primary rounded-full shadow-2xl" />

        <div className="absolute inset-0 flex items-center justify-around gap-1 px-2">
          {navItems
            .filter(
              (item) =>
                !item.adminOnly ||
                canViewAttendanceStatistics(user?.role),
            )
            .map((item) => {
            const Icon = item.icon;
            const isActive = item.children
              ? item.children.some((child) => currentPath === child.href)
              : currentPath === item.href;
            const isLogout = item.text === "Cerrar sesión";

            if (item.children) {
              return (
                <div key={item.text} className="relative mx-0 w-9">
                  <button
                    type="button"
                    aria-label={item.text}
                    aria-expanded={openGroup === item.text}
                    onClick={() =>
                      setOpenGroup((current) =>
                        current === item.text ? null : item.text,
                      )
                    }
                    className={`flex size-9 flex-col items-center justify-center rounded-full text-white transition ${
                      isActive || openGroup === item.text
                        ? "-translate-y-2 bg-primary"
                        : ""
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center rounded-full ${
                        isActive || openGroup === item.text
                          ? "bg-secondary p-1"
                          : ""
                      }`}
                    >
                      <Icon width={26} height={26} />
                    </span>
                  </button>
                  {(isActive || openGroup === item.text) && (
                    <p className="text-sm absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-white">
                      {item.text}
                    </p>
                  )}
                  {openGroup === item.text && (
                    <div className="absolute bottom-full left-1/2 z-50 mb-3 min-w-56 -translate-x-1/2 rounded-xl border border-border bg-card-bg p-2 shadow-lg">
                      <p className="px-3 py-2 text-xs font-bold uppercase text-text-muted">
                        {item.text}
                      </p>
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childIsActive = currentPath === child.href;

                        return (
                          <a
                            key={child.href}
                            href={child.href}
                            aria-current={childIsActive ? "page" : undefined}
                            onClick={() => setOpenGroup(null)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                              childIsActive
                                ? "bg-primary text-white"
                                : "text-primary hover:bg-primary/10"
                            }`}
                          >
                            <ChildIcon width={18} height={18} />
                            {child.text}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.text} className="relative mx-0 w-9">
                {isLogout ? (
                  <button
                    onClick={handleLogout}
                    className={`flex size-9 flex-col items-center justify-center ${
                      isActive
                        ? "bg-primary rounded-full -translate-y-2"
                        : ""
                    } text-white text-sm relative`}
                  >
                    <div
                      className={`flex ${
                        isActive ? "bg-red-500 text-white p-1 rounded-full" : ""
                      } flex-col items-center justify-center rounded-full transition-all duration-300`}
                    >
                      <Icon width={26} height={26} />
                    </div>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`flex size-9 flex-col items-center justify-center ${
                      isActive
                        ? "bg-primary rounded-full -translate-y-2"
                        : ""
                    } text-white text-sm relative`}
                  >
                    <div
                      className={`flex ${
                        isActive
                          ? "bg-secondary text-white p-1 rounded-full"
                          : ""
                      } flex-col items-center justify-center rounded-full transition-all duration-300`}
                    >
                      <Icon width={26} height={26} />
                    </div>
                  </a>
                )}

                {isActive && (
                  <p className="text-sm absolute bottom-0 left-1/2 -translate-x-1/2 text-white whitespace-nowrap">
                    {item.text}
                  </p>
                )}
              </div>
            );
            })}
        </div>
      </div>
    </aside>
  );
}
