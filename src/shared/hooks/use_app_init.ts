// useAppInit.ts
"use client";

import { useEffect, useState } from "react";

export function useAppInit() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      // aquí puedes:
      // - validar auth
      // - leer cookies
      // - cargar datos base (periodo por defecto, usuario, etc.)

      await new Promise((res) => setTimeout(res, 800)); // simula carga

      setIsInitializing(false);
    }

    init();
  }, []);

  return { isInitializing };
}