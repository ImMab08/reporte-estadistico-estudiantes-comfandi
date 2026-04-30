"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { navItems } from "./data";
import { User } from "@/src/lib/user";
import { getUserFromCookie } from "@/src/lib/auth";

export function MobileMenu() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getUserFromCookie();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    document.cookie = "user=; path=/; max-age=0";

    sessionStorage.removeItem("app_initialized");
    sessionStorage.removeItem("just_logged_in");

    window.location.href = "/auth";
  };

  return (
    <aside className="w-full md:hidden z-50 px-4 py-2 bg-white">
      <div className="relative h-18 flex items-center justify-center">
        <div className="absolute bottom-0 w-full h-full bg-primary rounded-full shadow-2xl" />

        <div className="absolute inset-0 flex items-center justify-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isLogout = item.text === "Cerrar sesión";

            return (
              <div key={item.text} className="relative mx-2">
                {isLogout ? (
                  <button
                    onClick={handleLogout}
                    className={`flex flex-col items-center ${
                      isActive
                        ? "bg-primary rounded-full -translate-y-4 p-2"
                        : ""
                    } text-white text-sm relative`}
                  >
                    <div
                      className={`flex ${
                        isActive ? "bg-red-500 text-white p-3 rounded-full" : ""
                      } flex-col items-center justify-center rounded-full transition-all duration-300`}
                    >
                      <Icon width={26} height={26} />
                    </div>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`flex flex-col items-center ${
                      isActive
                        ? "bg-primary rounded-full -translate-y-4 p-2"
                        : ""
                    } text-white text-sm relative`}
                  >
                    <div
                      className={`flex ${
                        isActive
                          ? "bg-secondary text-white p-3 rounded-full"
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
