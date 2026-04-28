"use client";

import {
  IconMonitoring,
  IconSchool,
  IconShieldLocked,
} from "@/src/shared/icons";
import Image from "next/image";
import { useState } from "react";

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

    const credentials = {
      "antonyreyes@comfandi.edu.co": "A9k#2LmPq1", // p
      "brandonmunoz@comfandi.edu.co": "X7t!4BnZr8", // p
      "carolinaortiz@comfandi.edu.co": "Q2w#9LpAs6", // p
      "catalinaquijano@comfandi.edu.co": "M8n!3KxTz5", // prescolar
      "dahianlibhertiz@comfandi.edu.co": "R4v#7YsPq2", // s
      "yuliethpulgarin@comfandi.edu.co": "T6m!1WxLo9", // p
      "dianacarabali@comfandi.edu.co": "Z3p#8QrNs4", // s
      "clorenaburbano@comfandi.edu.co": "B9x!5VtKj7", // s
      "fabertenorio@comfandi.edu.co": "H2k#6LmQw8", // s
      "gustavomontana@comfandi.edu.co": "P7s!3DzXc1", // s
      "jennysalas@comfandi.edu.co": "L4a#9TrYu6", // y
      "joanrojas@comfandi.edu.co": "W8e!2FgHb5", // s
      "johnnyospina@comfandi.edu.co": "C1v#7NmLp9", // p y s y consejo 
      "lauramarcelaospina@comfandi.edu.co": "Y5t!8QwEr2", // p 
      "leonelamariles@comfandi.edu.co": "N3b#6XsZa7", // p
      "maritzamunoz@comfandi.edu.co": "K9m!4JpLo1", // p
      "nataliafreyre@comfandi.edu.co": "D2q#7RwTy8", // p
      "oscargomez@comfandi.edu.co": "F6z!3XcVa9", // p y s
      "patriciacaicedo@comfandi.edu.co": "U1y#5GhJk4", // p
      "yulifigueroa@comfandi.edu.co": "S8r!2LpMn6", // p y consejo
      "zandrarodriguez@comfandi.edu.co": "E4t#9VkBj3", // prescolar
      "ricardopalacio@comfandi.edu.co": "I7o!1AsDf5", // p
      "stephanieespada@comfandi.edu.co": "O3p#6YuGh8", // eliminar
      "cristiangaon@comfandi.edu.co": "G5h#8TkLm1", // p y s
      "wilmarandrade@comfandi.edu.co": "J2n!4PoQs9", // s
      "yoselinclavijo@comfandi.edu.co": "X6z#1WaEr3", // s
      "vivianapalomino@comfandi.edu.co": "Q8s!5DfGh2", // p
      "vanessagarcia@comfandi.edu.co": "R3v#7TyUi6", // p
      "juandavidcelisruiz@comfandi.edu.co": "M1k!9LpZo4", // s
      "luisalejandrolondono@comfandi.edu.co": "T7b#2NxCv8", // s
      "geraldinelopez@comfandi.edu.co": "P4q!6AsWd1", // s
      "alejandramendez@comfandi.edu.co": "K9t#2LmQw7", // s
      "carlosmendez@comfandi.edu.co": "R4p!8XsZa1", // s
      "sofiavargas@comfandi.edu.co": "M6n#3QwEr9", // p
      "anamariadarema@comfandi.edu.co": "T1v!7LpZo5", // p y s
      "hernandosamboni@comfandi.edu.co": "B8x#4DfGh2", // s
      "valerydejesus@comfandi.edu.co": "Y3k!9AsWd6", // s
      "alexandrarodriguez@comfandi.edu.co": "P7s#2TyUi8", // s
      "leislymejia@comfandi.edu.co": "H5q!1NmLp4", // s
      "juandavidariasmunoz@comfandi.edu.co": "Z2m#6ReWx9", // consejo
      "victorperilla@comfandi.edu.co": "D8t!3YuGh1", // eliminar 
      "mairaserrato@comfandi.edu.co": "F4b#7PoQs5", // consejo
      "jeanordonez@comfandi.edu.co": "L9r!2TkLm8",
      "frankyvargas@comfandi.edu.co": "S1p#6WaEr3", 
      "angelaagudelo@comfandi.edu.co": "C7n!4VbXy9", // prescolar
      "koraynzapata@comfandi.edu.co": "Q3z#8JkLo2", // p
      "isabellarosero@comfandi.edu.co": "Ckma!4Vb119", // psicologa
      "dianaparra@comfandi.edu.co": "2TFFLm8=!", // psicologa 
      "brendagranados@comfandi.edu.co": "MnJk!223#", // psicologa 
      "rectorcolegioyumbo@comfandi.com.co": "rectorsito123", // rector 
      "falinepepicano@comfandi.edu.co": "hask!24#", // coordinadora
      "alexandracortes@comfandi.edu.co": "ghKlmn892!" // coordinadora
    };

    for (const [key, value] of Object.entries(credentials)) {
      if (email === key && password === value) {
        document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 1 día
        window.location.href = "/";
        return;
      }
    }

    // Si ninguna credencial coincidió, mostrar error
    setErrors({
      general: "Correo o contraseña incorrectos. Verifica tus credenciales.",
    });
  };

  return (
    <section className="relative w-full flex items-center justify-center h-screen overflow-hidden bg-[#EEF3F8] px-8 md:px-16">
      <div className="absolute z-0 -bottom-45 -right-45 w-400 -rotate-8 h-130 bg-[#C8D4FF] blur-[250px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10 h-full flex flex-col md:grid md:grid-cols-2">
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
              <p className="relative -bottom-4 text-sm text-gray-500 text-center font-medium">
                ¿Necesitas ayuda?{" "}
                <span className="text-[#10B8F5] cursor-pointer hover:underline">
                  Contáctanos
                </span>
              </p>
            </div>
          </div>

          <div className="hidden md:block max-w-sm text-center space-y-5 px-5">
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
        <div className="absolute -top-50 -right-20 w-80 h-80 border border-dashed border-[#10B8F5] rounded-full" />
        <div className="absolute -bottom-100 -right-28 w-160 h-160 border border-dashed border-[#10B8F5] rounded-full" />

        {/* Lado derecho (SIN TOCAR) */}
        <div className="relative h-full md:overflow-hidden flex md:flex-col justify-center items-end ">
          <div className="absolute z-20 bottom-38 left-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2 h-2 bg-[#00B8F0] rounded-full" />
            ))}
          </div>
          <div className="absolute z-20 top-90 left-56 grid grid-cols-3 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-1 h-1 bg-[#00B8F0]/60 rounded-full" />
            ))}
          </div>
          <div className="absolute z-20 top-80 right-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2 h-2 bg-[#00B8F0]/40 rounded-full" />
            ))}
          </div>

          <div className="hidden relative md:flex flex-col text-right">
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
          <div className="relative bottom-4 md:absolute md:bottom-10 w-full flex justify-end">
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
