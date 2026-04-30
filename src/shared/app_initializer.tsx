"use client";

import { useEffect, useState } from "react";
import { GlobalLoader } from "./global_loader";
import { getUserFromCookie } from "@/src/lib/auth";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const user = getUserFromCookie();
    if (!user) return;

    const justLoggedIn = sessionStorage.getItem("just_logged_in");

    if (!justLoggedIn) return;

    setIsInitializing(true);

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
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!mounted) return null;

  if (isInitializing) {
    return (
      <GlobalLoader progress={progress} message="Cargando información..." />
    );
  }

  return <>{children}</>;
}
