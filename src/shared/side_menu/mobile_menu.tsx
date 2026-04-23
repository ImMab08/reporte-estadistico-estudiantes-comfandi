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
              <a
                key={item.text}
                href={item.href}
                className={`flex flex-col items-center ${isActive ? "bg-primary rounded-full -translate-y-4 p-2" : ""} text-white text-sm relative`}
              >
                {/* Botón activo */}
                <div
                  className={`flex ${isActive ? "bg-alto text-white p-4 rounded-full" : ""} flex-col items-center justify-center rounded-full transition-all duration-300`}
                >
                  <Icon width={28} height={28} />
                </div>
                  {isActive ? <span className=" mt-1">{item.text}</span> : ""}

              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
