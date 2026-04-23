"use client";

import Image from "next/image";

type Props = {
  progress?: number;
  message?: string;
};

export function GlobalLoader({ progress = 0, message = "Cargando..." }: Props) {
  return (
    <div className="fixed inset-0 z-9999 bg-background flex flex-col items-center justify-center gap-6">
      {/* Logos */}
      <div className="relative -left-5 flex items-center justify-center gap-4">
        <div className="w-40 h-20 relative">
          <Image
            src="/img/logo/logo_edumetrics_dos.png"
            alt="Edumetricks"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="relative -left-4 z-10 w-0.5 h-14 bg-primary" />

        <div className="w-28 h-14 relative">
          <Image
            src="/img/logo/logo_comfandi_blue.svg"
            alt="Comfandi"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Barra */}
      <div className="w-60 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Texto */}
      <p className="text-sm text-muted-foreground">
        {message} {progress}%
      </p>
    </div>
  );
}
