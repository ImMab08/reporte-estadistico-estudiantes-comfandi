"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { getUserFromCookie } from "@/src/lib/auth";
import { IconCalendarToday } from "@/src/shared/icons";
import { blocks, days, subjectConfig } from "@/src/shared/constants/classes";

type ClassItem = {
  block: number;
  subject: string;
  grade: string;
};

type DaySchedule = {
  day: string;
  classes: ClassItem[];
};

type Schedule = {
  week: DaySchedule[];
};

type User = {
  email: string;
  password: string;
  role: string;
  niveles: string[];
  schedule?: Schedule;
};

export function AccountFeacture() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getUserFromCookie() as User | null;
    if (u) setUser(u);
  }, []);

  /* ================= CLASSES ================= */

  const classes = useMemo(() => {
    if (!user?.schedule?.week) return [];

    const dayMap: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
    };

    const result: {
      day: number;
      start: number;
      span: number;
      subject: string;
      grade: string;
      color: string;
      icon: any;
    }[] = [];

    user.schedule.week.forEach((day) => {
      const dayIndex = dayMap[day.day];

      const sorted = [...day.classes].sort((a, b) => a.block - b.block);

      let current: (typeof result)[number] | null = null;

      sorted.forEach((c) => {
        const config = subjectConfig[
          c.subject as keyof typeof subjectConfig
        ] ?? {
          color: "bg-slate-100 border-slate-200 text-slate-700",
          icon: IconCalendarToday,
        };

        if (
          current &&
          current.subject === c.subject &&
          current.grade === c.grade &&
          current.start + current.span === c.block
        ) {
          current.span += 1;
        } else {
          if (current) result.push(current);

          current = {
            day: dayIndex,
            start: c.block,
            span: 1,
            subject: c.subject,
            grade: c.grade,
            color: config.color,
            icon: config.icon,
          };
        }
      });

      if (current) result.push(current);
    });

    return result;
  }, [user]);

  /* ================= UI ================= */

  return (
    <section className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Perfil</h1>
          <p className="text-sm text-slate-500">
            Información personal y profesional
          </p>
        </div>

        <Image
          src="/img/logo/logo_comfandi_blue.svg"
          alt="logo"
          width={100}
          height={40}
        />
      </header>

      <div className="w-full overflow-auto">
        {/* PERFIL */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/img/avatar.jpg"
                alt="avatar"
                width={80}
                height={80}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Nicolás Ramírez
              </h2>
              <p className="text-sm text-slate-500">Docente</p>

              <div className="mt-2 text-sm text-slate-500 space-y-1">
                <p>📧 nramirez@edumetricks.edu.co</p>
                <p>📞 300 123 4567</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center text-sm">
            <div>
              <p className="text-slate-400">Materias</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  Matemáticas
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  Física
                </span>
              </div>
            </div>

            <div>
              <p className="text-slate-400">Grados</p>
              <div className="flex gap-2 mt-1">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs">
                  10°
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs">
                  11°
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {/* HORARIO */}
        <div className="w-full overflow-x-auto md:overflow-visible">
          {/* <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100">
                <IconCalendarToday className="text-primary" />
              </div>
              <div>
                <h3 className="text-primary font-bold text-lg leading-5">
                  Horario semanal
                </h3>
                <p className="text-xs text-slate-500">
                  Vista de clases y actividades asignadas
                </p>
              </div>
            </div>
          </div> */}

          {/* GRID */}
          <div
            className="grid rounded-xl border border-slate-200 w-full md:min-w-0 min-w-175"
            style={{
              gridTemplateColumns: "80px repeat(5, 140px)",
              gridTemplateRows: `40px repeat(${blocks.length}, 65px)`,
            }}
          >
            {/* HEADER */}
            <div className="bg-slate-50 border-b border-r border-slate-200 flex items-center justify-center text-xs font-semibold sticky left-0 z-20">
              Hora
              {b.time}
            </div>

            {days.map((d, i) => (
              <div
                key={i}
                className="bg-slate-50 border-b border-r border-slate-200 flex items-center justify-center text-xs font-semibold"
              >
                {d.name}
              </div>
            ))}

            {/* COLUMNA DE HORAS (FIJA) */}
            {blocks.map((b, i) => (
              <div
                key={i}
                style={{ gridColumn: 1, gridRow: i + 2 }}
                className={`sticky left-0 z-10 flex flex-col items-center justify-center text-[11px] border-r border-b border-slate-200 ${
                  b.type
                    ? "bg-blue-50 text-primary font-semibold"
                    : "bg-white text-slate-500"
                }`}
              >
                <span className="font-semibold text-xs">{b.label}</span>
                <span className="text-[10px]">
                  {b.start} - {b.end}
                </span>
              </div>
            ))}

            {/* GRID BASE */}
            {blocks.map((_, rowIndex) =>
              days.map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    gridColumn: colIndex + 2,
                    gridRow: rowIndex + 2,
                  }}
                  className="border-b border-r border-slate-200 bg-white"
                />
              )),
            )}

            {/* CLASES */}
            {classes.map((c, i) => {
              const Icon = c.icon;
              const isSmall = c.span === 1;

              return (
                <div
                  key={i}
                  style={{
                    gridColumn: c.day + 1,
                    gridRow: `${c.start + 1} / span ${c.span}`,
                  }}
                  className={`relative z-0 m-0.5 p-2 overflow-hidden rounded-lg border text-xs shadow-sm ${c.color}`}
                >
                  <p className="font-semibold">{c.subject}</p>

                  <p className="text-[10px] opacity-80">{c.grade}</p>

                  <Icon
                    className={`absolute rotate-12 opacity-5 ${
                      isSmall
                        ? "size-16 -right-2 -bottom-4"
                        : "size-24 -right-5 -bottom-5"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
