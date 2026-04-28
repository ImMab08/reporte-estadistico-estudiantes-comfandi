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
      "antonyreyes@comfandi.edu.co": "A9k#2LmPq1",
      "brandonmunoz@comfandi.edu.co": "X7t!4BnZr8",
      "carolinaortiz@comfandi.edu.co": "Q2w#9LpAs6",
      "catalinaquijano@comfandi.edu.co": "M8n!3KxTz5",
      "dahianlibhertiz@comfandi.edu.co": "R4v#7YsPq2",
      "yuliethpulgarin@comfandi.edu.co": "T6m!1WxLo9",
      "dianacarabali@comfandi.edu.co": "Z3p#8QrNs4",
      "clorenaburbano@comfandi.edu.co": "B9x!5VtKj7",
      "fabertenorio@comfandi.edu.co": "H2k#6LmQw8",
      "gustavomontana@comfandi.edu.co": "P7s!3DzXc1",
      "jennysalas@comfandi.edu.co": "L4a#9TrYu6",
      "joanrojas@comfandi.edu.co": "W8e!2FgHb5",
      "johnnyospina@comfandi.edu.co": "C1v#7NmLp9",
      "lauramarcelaospina@comfandi.edu.co": "Y5t!8QwEr2",
      "leonelamariles@comfandi.edu.co": "N3b#6XsZa7",
      "maritzamunoz@comfandi.edu.co": "K9m!4JpLo1",
      "nataliafreyre@comfandi.edu.co": "D2q#7RwTy8",
      "oscargomez@comfandi.edu.co": "F6z!3XcVa9",
      "patriciacaicedo@comfandi.edu.co": "U1y#5GhJk4",
      "yulifigueroa@comfandi.edu.co": "S8r!2LpMn6",
      "zandrarodriguez@comfandi.edu.co": "E4t#9VkBj3",
      "ricardopalacio@comfandi.edu.co": "I7o!1AsDf5",
      "stephanieespada@comfandi.edu.co": "O3p#6YuGh8",
      "cristiangaon@comfandi.edu.co": "G5h#8TkLm1",
      "wilmarandrade@comfandi.edu.co": "J2n!4PoQs9",
      "yoselinclavijo@comfandi.edu.co": "X6z#1WaEr3",
      "vivianapalomino@comfandi.edu.co": "Q8s!5DfGh2",
      "cvanessagarcia@comfandi.edu.co": "R3v#7TyUi6",
      "juandavidcelisruiz@comfandi.edu.co": "M1k!9LpZo4",
      "luisalejandrolondono@comfandi.edu.co": "T7b#2NxCv8",
      "geraldinelopez@comfandi.edu.co": "P4q!6AsWd1",
      "alejandramendez@comfandi.edu.co": "K9t#2LmQw7",
      "carlosmendez@comfandi.edu.co": "R4p!8XsZa1",
      "sofiavargas@comfandi.edu.co": "M6n#3QwEr9",
      "anamariadarema@comfandi.edu.co": "T1v!7LpZo5",
      "hernandosamboni@comfandi.edu.co": "B8x#4DfGh2",
      "valerydejesus@comfandi.edu.co": "Y3k!9AsWd6",
      "alexandrarodriguez@comfandi.edu.co": "P7s#2TyUi8",
      "leislymejia@comfandi.edu.co": "H5q!1NmLp4",
      "juandavidariasmunoz@comfandi.edu.co": "Z2m#6ReWx9",
      "victorperilla@comfandi.edu.co": "D8t!3YuGh1",
      "mairaserrato@comfandi.edu.co": "F4b#7PoQs5",
      "jeanordonez@comfandi.edu.co": "L9r!2TkLm8",
      "frankyvargas@comfandi.edu.co": "S1p#6WaEr3",
      "angelaagudelo@comfandi.edu.co": "C7n!4VbXy9",
      "koraynzapata@comfandi.edu.co": "Q3z#8JkLo2",

    }

    for (const [key, value] of Object.entries(credentials)) {
      if (email === key && password === value) {
        document.cookie = "isAuthenticated=true; path=/";
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
    <section className="relative w-full flex items-center justify-center h-screen overflow-hidden bg-[#EEF3F8] py-6 px-8 md:px-16">
      <div className="absolute z-0 -bottom-45 -right-45 w-400 -rotate-8 h-130 bg-[#C8D4FF] blur-[250px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10 h-full flex flex-col md:grid md:grid-cols-2 ">
        {/* Lado izquierdo */}
        <div className="h-full flex flex-col justify-between py-10">
          <div>
            <Image
              src="/img/logo/logo_comfandi_blue.svg"
              alt="Comfandi"
              width={150}
              height={64}
              className="object-contain"
            />
          </div>

          <div className="w-full max-w-sm space-y-10 rounded-xl bg-white py-10 px-5">
            <div className="space-y-2 text-primary">
              <h2 className="text-lg font-medium leading-none">Bienvenido a</h2>

              <h1 className="text-5xl font-bold leading-9 tracking-tight">
                Edumetricks
              </h1>

              <p className="text-lg text-[#8EB2F3] font-medium">
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-primary">
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
                className="w-full h-12 mt-6 cursor-pointer rounded-full bg-primary text-white text-[22px] font-semibold hover:opacity-95 transition"
              >
                Ingresar
              </button>
            </div>
          </div>

          <div className="max-w-sm text-center space-y-5 px-5">
            <p className="text-[15px] text-gray-500 font-medium">
              ¿Necesitas ayuda?{" "}
              <span className="text-[#10B8F5] cursor-pointer hover:underline">
                Contáctanos
              </span>
            </p>

            <div className="hidden md:block text-sm leading-5 text-gray-400">
              <p>© 2026 Comfandi - Campus E Yumbo</p>
              <p>Todos los derechos reservados.</p>
            </div>
          </div>
        </div>

        {/* Curvas */}
        <div className="absolute -top-50 -right-20 w-80 h-80 border border-dashed border-[#10B8F5] rounded-full" />
        <div className="absolute -bottom-100 -right-28 w-160 h-160 border border-dashed border-[#10B8F5] rounded-full" />

        {/* Lado derecho (SIN TOCAR) */}
        <div className="relative h-full overflow-hidden flex md:flex-col justify-center items-end ">
          <div className="absolute z-10 bottom-38 left-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2 h-2 bg-[#00B8F0] rounded-full" />
            ))}
          </div>

          <div className="relative flex flex-col text-right">
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
          <div className="absolute bottom-10 w-full flex justify-end">
            <div className="w-full max-w-2xl bg-primary backdrop-blur rounded-[28px] shadow-md px-6 py-4">
              <div className="grid grid-cols-3 gap-8 text-center">
                {/* Item 1 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconSchool
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-sm text-white font-medium leading-tight">
                    Información <br /> en tiempo real
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconMonitoring
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-sm text-white font-medium leading-tight">
                    Métricas y análisis <br /> estadístico académico
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8EEF7] flex items-center justify-center">
                    <IconShieldLocked
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-sm text-white font-medium leading-tight">
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
