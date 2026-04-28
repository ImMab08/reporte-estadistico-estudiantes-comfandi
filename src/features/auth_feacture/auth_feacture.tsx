"use client";

import Image from "next/image";
import { useState } from "react";
import users from "@/src/lib/users.json";

import {
  IconMonitoring,
  IconSchool,
  IconShieldLocked,
} from "@/src/shared/icons";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Correo inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const user = users.find(
      (u) =>
        u.email === email.trim().toLowerCase() &&
        u.password === password.trim(),
    );

    if (user) {
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(user),
      )}; path=/; max-age=86400`;

      window.location.href = "/";
      return;
    }

    setErrors({
      general: "Correo o contraseña incorrectos. Verifica tus credenciales.",
    });
  };

  return (
    <section className="relative w-full flex items-center justify-center h-screen overflow-hidden bg-[#EEF3F8] px-8 md:px-16">
      <div className="absolute z-0 -bottom-45 -right-45 w-400 -rotate-8 h-130 bg-[#C8D4FF] blur-[250px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10 h-auto md:h-full flex flex-col items-center justify-center md:grid md:grid-cols-2">
        {/* Lado izquierdo */}
        <div className="h-full flex flex-col items-center md:items-start justify-between py-5 md:py-10 gap-5 md:gap-0 relative z-40">
          <Image
            width={150}
            height={64}
            alt="Logo Comfandi"
            src="/img/logo/logo_comfandi_blue.svg"
            className="object-contain hidden md:block"
          />
          <Image
            width={120}
            height={64}
            alt="Logo Comfandi"
            src="/img/logo/logo_comfandi_blue.svg"
            className="object-contain block md:hidden"
          />

          <div className="w-full max-w-sm space-y-5 md:space-y-10 rounded-xl bg-white py-10 px-5">
            <div className="space-y-2 text-primary">
              <h2 className="text-lg font-medium leading-none">Bienvenido a</h2>

              <h1 className="text-4xl md::text-5xl font-bold leading-5 md:leading-9 tracking-tight">
                Edumetricks
              </h1>

              <p className="text:xs md:text-lg text-[#8EB2F3] font-medium">
                Accede a tu panel académico
              </p>
            </div>

            <div className="space-y-5">
              {/* ERROR GENERAL */}
              {errors.general && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.general}
                </p>
              )}

              {/* Correo */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-primary">
                  Correo electrónico
                </label>

                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                      general: undefined,
                    }));
                  }}
                  className="w-full h-10 rounded-xl border border-primary/70 bg-transparent px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/15"
                />

                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs md:text-sm font-semibold text-primary">
                    Contraseña
                  </label>

                  {/* <button
                    type="button"
                    className="text-sm cursor-pointer font-medium text-[#8EB2F3] hover:underline"
                  >
                    Olvidé mi contraseña
                  </button> */}
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                      general: undefined,
                    }));
                  }}
                  className="w-full h-10 rounded-xl border border-primary/70 bg-transparent px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/15"
                />

                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Botón */}
              <button
                onClick={handleSubmit}
                className="w-full h-10 md:h-12 mt-4 md:mt-6 cursor-pointer rounded-full bg-primary text-white text-[22px] font-semibold hover:opacity-95 transition"
              >
                Ingresar
              </button>
              <p className="relative md:hidden -bottom-4 text-sm text-gray-500 text-center font-medium">
                ¿Necesitas ayuda?{" "}
                <span className="text-[#10B8F5] cursor-pointer hover:underline">
                  Contáctanos
                </span>
              </p>
            </div>
          </div>

          <div className="md:hidden md:bottom-10 w-full ">
            <div className="w-full max-w-2xl bg-primary backdrop-blur rounded-xl shadow-md px-6 py-4">
              <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
                {/* Item 1 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconSchool
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconSchool
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] md:block md:text-sm text-white font-medium leading-tight">
                    Información <br /> en tiempo real
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconMonitoring
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconMonitoring
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] hidden md:block md:text-sm text-white font-medium leading-tight">
                    Métricas y análisis <br /> estadístico académico
                  </p>

                  <p className="text-[9px] md:hidden md:text-sm text-white font-medium leading-tight">
                    Análisis estadístico académico
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconShieldLocked
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconShieldLocked
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] md:block md:text-sm text-white font-medium leading-tight">
                    Seguridad <br /> y confianza
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-full max-w-sm text-center space-y-5 px-5">
            <p className="text-[15px] text-gray-500 font-medium">
              ¿Necesitas ayuda?{" "}
              <span className="text-[#10B8F5] cursor-pointer hover:underline">
                Contáctanos
              </span>
            </p>

            <div className="text-sm leading-5 text-gray-400">
              <p>© 2026 Comfandi - Campus E Yumbo</p>
              <p>Todos los derechos reservados.</p>
            </div>
          </div>
        </div>

        {/* Curvas */}
        <div className="hidden md:block absolute -top-50 -right-20 w-80 h-80 border border-dashed border-[#10B8F5] rounded-full" />
        <div className="hidden md:block absolute -bottom-100 -right-28 w-160 h-160 border border-dashed border-[#10B8F5] rounded-full" />

        {/* Lado derecho (SIN TOCAR) */}
        <div className="relative hidden h-full md:overflow-hidden md:flex md:flex-col justify-center items-end ">
          <div className="absolute z-20 bottom-38 left-4 md:grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2 h-2 bg-[#00B8F0] rounded-full" />
            ))}
          </div>
          <div className="absolute z-20 top-90 left-56 md:grid grid-cols-3 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-1 h-1 bg-[#00B8F0]/60 rounded-full" />
            ))}
          </div>
          <div className="absolute z-20 top-80 right-4 md:grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2 h-2 bg-[#00B8F0]/40 rounded-full" />
            ))}
          </div>

          <div className="relative md:flex flex-col text-right">
            <h2 className="hidden md:block text-primary leading-11 text-4xl lg:text-5xl font-bold mb-24">
              Educación <br />
              impulsada por datos
            </h2>

            <Image
              width={500}
              height={320}
              alt="Educación"
              src="/img/image_auth.png"
              className="object-contain relative"
            />
          </div>

          {/* Card inferior */}
          <div className="hidden md:absolute md:bottom-10 w-full md:flex justify-end">
            <div className="w-full max-w-2xl bg-primary backdrop-blur rounded-xl shadow-md px-6 py-4">
              <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
                {/* Item 1 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconSchool
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconSchool
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] md:block md:text-sm text-white font-medium leading-tight">
                    Información <br /> en tiempo real
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconMonitoring
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconMonitoring
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] hidden md:block md:text-sm text-white font-medium leading-tight">
                    Métricas y análisis <br /> estadístico académico
                  </p>

                  <p className="text-[9px] md:hidden md:text-sm text-white font-medium leading-tight">
                    Análisis estadístico académico
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="size-8 md:size-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconShieldLocked
                      width={28}
                      height={28}
                      className="text-primary hidden md:block"
                    />
                    <IconShieldLocked
                      width={22}
                      height={22}
                      className="text-primary block md:hidden"
                    />
                  </div>
                  <p className="text-[9px] md:block md:text-sm text-white font-medium leading-tight">
                    Seguridad <br /> y confianza
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
