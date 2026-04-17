"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navItems } from "./data";

export function SideMenu() {
  const pathname = usePathname();

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const renderMenuItem = (item: (typeof navItems)[number]) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    const content = (
      <>
        <div
          className={`w-1 bg-primary rounded-full origin-left transition-transform duration-300 ${isActive
              ? "scale-y-100"
              : "scale-y-0 group-hover:scale-y-100"
            }`}
        ></div>

        <div
          className={`flex relative items-center space-x-2 w-full py-1 px-2 rounded-lg transition-all duration-300 ${isActive
              ? "bg-primary text-white"
              : "text-primary bg-white group-hover:bg-primary group-hover:text-white -left-3 group-hover:left-0"
            }`}
        >
          <Icon width={20} hanging={20} />

          <p className="font-semibold transition-colors duration-300">
            {item.text}
          </p>
        </div>
      </>
    );

    // 🔥 SOLO estudiantes con hard navigation
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
    <div className="max-w-50 w-full h-screen bg-white">
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
              .filter((item) => item.position !== "bottom")
              .map(renderMenuItem)}
          </div>

          {/* Parte inferior */}
          <div className="mt-auto space-y-2">
            {navItems
              .filter((item) => item.position === "bottom")
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
            <p>© 2026 Edumetrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}