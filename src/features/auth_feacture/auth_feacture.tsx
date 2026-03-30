"use client";

import { useState } from "react";

import { IconError, IconInfo } from "@/src/shared/icons"; 
import Link from "next/link";
import Router from "next/router";

export function AuthScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  type InputStatus = "default" | "error" | "info";

  const handleAuth = async () => {
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setInfo("Debes de rellenar todos los campos.");
      return;
    }

    setLoading(true);

    // const { error: authError } = await createClient.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    setLoading(false);

    // if (authError) {
    //   setError("El correo o la contraseña son incorrectos.");
    //   return;
    // }

    Router.push("/admin");
  };

  // //? Estilos reutilizables
  const inputClass = (status: InputStatus = "default") => {
    const base =
      "h-10 rounded-lg border px-3 outline-none focus:ring-2 transition-all";

    if (status === "error") {
      return `${base} border-red-500 focus:ring-red-500`;
    }

    if (status === "info") {
      return `${base} border-blue-500 focus:ring-blue-500`;
    }

    return `${base} border-border focus:ring-primary`;
  };

  const labelClass = (status: InputStatus = "default") => {
    const base = "font-semibold text-sm";
    if (status === "error") {
      return `${base} text-red-500`;
    }

    if (status === "info") {
      return `${base} text-blue-500`;
    }

    return `${base} text-text-primary`;
  };

  return (
    <div className="flex flex-1 h-screen text-text-primary overflow-hidden">
      <div className="absolute top-0 w-full mx-auto p-8">
        {/* <nav className="relative flex items-center justify-between sm:h-10">
          <Link href="/">
            <IconArrowBack className="" />
          </Link>
        </nav> */}
      </div>
      <div className="flex flex-col items-center flex-1 shrink-0 px-5 pt-16 pb-8 border-r border-border shadow-lg bg-anotherbg">
        <div className="flex-1 flex flex-col justify-center w-88.5 sm:w-[384px]">
          <div className="mb-20 space-y-1">
            <h2 className="text-3xl font-semibold">Bienvenido de vuelta</h2>
            <h3 className="text-base text-text-primary/40">
              inicia sesión con tu cuenta
            </h3>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Correo */}
            <div className="flex flex-col space-y-2">
              <label
                className={labelClass(
                  error ? "error" : info ? "info" : "default",
                )}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className={inputClass(
                  error ? "error" : info ? "info" : "default",
                )}
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <label
                  className={labelClass(
                    error ? "error" : info ? "info" : "default",
                  )}
                >
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-sm text-text-primary/40 hover:text-text-primary duration-300 transition-all hover:underline"
                >
                  Olvidé mi contraseña
                </Link>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className={inputClass(
                  error ? "error" : info ? "info" : "default",
                )}
              />
            </div>
            {info && (
              <div className="flex items-center space-x-2">
                <IconInfo className="text-blue-500" />
                <p className="text-sm text-blue-500">{info}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2">
                <IconError className="text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full p-4 bg-tertiary/60 hover:bg-tertiary transition-all duration-200 rounded-3xl mt-10 cursor-pointer text-lg font-semibold"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
        <div className="text-center text-balance text-xs text-foreground-lighter sm:mx-auto sm:max-w-sm space-y-2 select-none">
          <p className="">Hecho con 💚 para el mundo</p>
          <p className="">© Franky Vargas - 2026</p>
        </div>
      </div>

      <div className="flex-col items-center justify-center flex-1 shrink hidden basis-1/4 xl:flex">
        <div className="relative flex flex-col gap-6 text-text-primary">
          <div className="absolute select-none -top-12 -left-14">
            <span className="text-[160px] leading-none ">“</span>
          </div>
          <blockquote className="z-10 max-w-lg text-3xl">
            Porque yo Jehová soy tu Dios, quien te sostiene de tu mano derecha,
            y te dice: No temas, yo te ayudo.
          </blockquote>
          <p className="italic font-medium text-foreground-light whitespace-nowrap">
            Isaías 41:13
          </p>
        </div>
      </div>
    </div>
  );
}
