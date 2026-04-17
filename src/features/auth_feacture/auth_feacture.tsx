"use client";

import { useState } from "react";
import Image from "next/image";
import { IconError, IconInfo } from "@/src/shared/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const router = useRouter();

  type InputStatus = "default" | "error" | "info";

  const handleAuth = async () => {
    setError(null);
    setInfo(null);


    const validUsers = [
      { email: "docentes@comfandi.edu.co", password: "comfandi" }
    ];

    if (!email || !password) {
      setInfo("Debes de rellenar todos los campos.");
      return;
    }

    setLoading(true);

    const isValidUser = validUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!isValidUser) {
      setLoading(false);
      setError("Correo o contraseña incorrectos.");
      return;
    }

    // Establecemos la cookie para recordar la sesión
    document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // expira en 1 día

    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1000);
  };

  const inputClass = (status: InputStatus = "default") => {
    const base =
      "h-12 rounded-full border border-gray-300 px-5 outline-none focus:ring-2 transition-all w-full text-sm bg-white";

    if (status === "error") {
      return `${base} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }

    if (status === "info") {
      return `${base} border-blue-500 focus:ring-blue-500 focus:border-blue-500`;
    }

    return `${base} focus:ring-primary focus:border-primary`;
  };

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden font-sans">

      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#E8F4F8] to-[#D5EDF6] items-center justify-center">

        <div className="absolute top-0 right-0 h-full w-24 xl:w-32 text-background z-10 translate-x-[1px]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="currentColor"
            className="w-full h-full"
          >
            <path d="M100 0 L100 100 L0 100 C 60 75, 40 25, 0 0 Z" />
          </svg>
        </div>

        <div className="z-20 p-12 flex flex-col items-center">
          <Image
            src="/img/logo/logo_edumetrics.png"
            alt="Edumetrics"
            width={400}
            height={400}
            className="object-contain max-w-full drop-shadow-2xl"
            priority
          />
        </div>
      </div>


      <div className="flex flex-1 flex-col justify-center items-center px-6 relative z-20 bg-background lg:bg-transparent">
        <div className="w-full max-w-sm xl:max-w-md flex flex-col items-center">

          <div className="mb-14">
            <Image
              src="/img/logo/logo_comfandi_blue.svg"
              alt="Comfandi"
              width={240}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center mb-8 space-y-2">
            <h2 className="text-4xl font-light text-text-main">Bienvenido Docente</h2>
            <p className="text-sm text-text-muted">
              Inicia sesión para continuar
            </p>
          </div>

          <div className="w-full space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className={`pl-12 ${inputClass(error ? "error" : info ? "info" : "default")}`}
              />
            </div>


            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className={`pl-12 ${inputClass(error ? "error" : info ? "info" : "default")}`}
              />
            </div>

            {info && (
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                <IconInfo className="text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700">{info}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg">
                <IconError className="text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full h-12 bg-[#2BD4B6] hover:bg-[#25bc9f] text-white transition-all duration-200 rounded-full mt-2 cursor-pointer text-base font-semibold tracking-wide shadow-md shadow-[#2BD4B6]/30"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center text-xs text-text-muted/40 space-y-1">
          <p>Hecho con 💚 para comfandi</p>
          <p>© Franky Vargas & Jean Paul Ordoñez - 2026</p>
        </div>
      </div>
    </div>
  );
}
