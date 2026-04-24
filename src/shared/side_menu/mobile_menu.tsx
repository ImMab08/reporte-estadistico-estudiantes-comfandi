"use client";

import { usePathname } from "next/navigation";
import { navItems } from "./data";

export function MobileMenu() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 w-full md:hidden z-50 px-4 py-2 bg-white">
      <div className="relative h-18 flex items-center justify-center">
        {/* Fondo azul independiente */}
        <div className="absolute bottom-0 w-full h-full bg-primary rounded-full shadow-2xl" />

        {/* Navegación */}
        <div className="absolute inset-0 flex items-center justify-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <div key={item.text} className="relative mx-2">
                <a
                  href={item.href}
                  className={`flex flex-col items-center ${isActive ? "bg-primary rounded-full -translate-y-4 p-2" : ""} text-white text-sm relative`}
                >
                  {/* Botón activo */}
                  <div
                    className={`flex ${isActive ? "bg-secondary text-white p-3 rounded-full" : ""} flex-col items-center justify-center rounded-full transition-all duration-300`}
                  >
                    <Icon width={26} height={26} />
                  </div>
                </a>
                {isActive ? (
                  <p className="text-sm absolute bottom-0 left-1/2 -translate-x-1/2 text-white whitespace-nowrap">
                    {item.text}
                  </p>
                ) : (
                  ""
                )}{" "}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
