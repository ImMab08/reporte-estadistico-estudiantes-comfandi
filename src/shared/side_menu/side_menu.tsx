"use client";
import Link from "next/link";
import Image from "next/image";

import { navItems } from "./data";
import { IconLogout } from "../icons";
import { usePathname } from "next/navigation";

export function SideMenu() {
  const pathname = usePathname();

  return (
    <div className="max-w-50 w-full h-screen bg-white">
      <div className="h-full p-4 flex flex-col">
        {/* Logo */}
        <div className="flex w-full justify-center pb-4 border-b-2 border-primary/10">
          <Image
            alt=""
            width={150}
            height={150}
            className="object-contain"
            src="/img/logo/logo_comfandi_blue.svg"
          />
        </div>

        <div className="flex flex-col flex-1 mt-5">
          {/* Parte superior */}
          <div className="space-y-2">
            {navItems
              .filter((item) => item.position !== "bottom")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.text}
                    href={item.href}
                    className="flex space-x-2 items-stretch group"
                  >
                    <div className={`w-1 bg-primary rounded-full origin-left transition-transform duration-300 ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`}></div>
                    <div
                      className={`flex relative items-center space-x-2 w-full py-1 px-2 rounded-lg transition-all duration-300
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-primary bg-white  group-hover:bg-primary group-hover:text-white -left-3 group-hover:left-0"
                        }`
                      }
                    >
                      <Icon
                        width={20}
                        hanging={20}
                      />

                      <p className="font-semibold transition-colors duration-300">
                        {item.text}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* Parte inferior */}
          <div className="mt-auto space-y-2">
            {navItems
              .filter((item) => item.position === "bottom")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex space-x-2 items-stretch group"
                  >
                    <div className={`w-1 bg-primary rounded-full origin-left transition-transform duration-300 ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`}></div>
                    <div className={`flex relative items-center space-x-2 w-full py-1 px-2 rounded-lg transition-all duration-300
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-primary bg-white  group-hover:bg-primary group-hover:text-white -left-3 group-hover:left-0"
                        }`
                      }
                    >
                      <Icon
                        width={20}
                        hanging={20}
                      />

                      <p className="font-semibold transition-colors duration-300">
                        {item.text}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Cerrar sesión */}
        <div className="mt-4 flex flex-col space-y-2 p-2 pt-4 border-t-2 border-primary/10 rounded-lg cursor-pointer duration-300 text-red-500 hover:text-red-600">
          <div className="flex items-center space-x-2">
            <IconLogout width={20} hanging={20} />
            <p className="font-semibold">Cerrar sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
}
