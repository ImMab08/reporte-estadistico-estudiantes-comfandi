import Image from "next/image";
import React from "react";

export function Header() {
  return (
    <header className="w-full h-auto bg-primary px-6 py-4">
      <div className="">
        <Image
          width={140}
          height={140}
          alt="Logo Comfandi"
          src="../img/LogoComfandi2.svg"
        />
      </div>
    </header>
  );
}
