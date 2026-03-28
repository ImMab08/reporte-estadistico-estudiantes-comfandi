import React from "react";
import { IconHome, IconLogout, IconSchool } from "./icons";
import Image from "next/image";

export function SideMenu() {
  return (
    <div className="max-w-50 w-full h-screen border-r border-primary/10">
      <div className="size-full p-4 flex flex-col justify-between">
        <div className="size-full space-y-5">
          <div className="flex w-full justify-center pb-4 border-b-2 border-primary/10">
            <Image
              alt=""
              width={150}
              height={150}
              className="object-contain"
              src="/img/logo/logo_comfandi_blue.svg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex space-x-2 items-stretch">
              <div className="w-1 bg-primary rounded-full"></div>

              <div className="flex items-center space-x-2 w-full text-white bg-primary hover:bg-tertiary/60 duration-300 p-2 rounded-lg cursor-pointer">
                <IconHome width={20} hanging={20} className="" />
                <p className="font-semibold">Inicio</p>
              </div>
            </div>

            <div className="flex space-x-2 items-stretch">
              <div className="w-1 bg-primary rounded-full"></div>

              <div className="flex items-center space-x-2 w-full text-white bg-primary hover:bg-tertiary/60 duration-300 p-2 rounded-lg cursor-pointer">
                <IconSchool width={20} hanging={20} className="" />
                <p className="font-semibold">Estudiantes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 w-full p-2 rounded-lg cursor-pointer duration-300 text-red-500 hover:text-red-600">
          <IconLogout width={20} hanging={20} className="" />
          <p className="font-semibold">Cerrar sesión</p>
        </div>
      </div>
    </div>
  );
}
