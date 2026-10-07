"use client";

import { useEffect, useState } from "react";
import { GlobalLoader } from "./global_loader";
import { getUserFromCookie } from "@/src/lib/auth";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const user = getUserFromCookie();
    if (!user) return;

    const justLoggedIn = sessionStorage.getItem("just_logged_in");

    if (!justLoggedIn) return;

    const startTimeout = setTimeout(() => {
      setIsInitializing(true);
    }, 0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);

      setTimeout(() => {
        clearInterval(interval);

        sessionStorage.removeItem("just_logged_in");
        sessionStorage.setItem("app_initialized", "true");

        setIsInitializing(false);
      }, 300);
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (isInitializing) {
    return (
      <GlobalLoader progress={progress} message="Cargando información..." />
    );
  }

  return <>{children}</>;
}
