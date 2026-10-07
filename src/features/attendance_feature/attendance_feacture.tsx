"use client";

import { FormEvent, useState } from "react";
import { CustomSelect } from "@/src/components/ui/custom_select";
import { saveAttendance } from "@/src/app/attendance/actions";
import {
  IconAccountCircle,
  IconCalendarToday,
  IconGroup,
  IconSchool,
} from "@/src/shared/icons";

type Teacher = {
  userId: string;
  name: string;
};

type AttendanceGroup = {
  id: string;
  number: number;
  gradeCode: string;
};

type Props = {
  teachers: Teacher[];
  groups: AttendanceGroup[];
};

const grades = [
  { value: "JARDIN", label: "Jardín" },
  { value: "TRANSICION", label: "Transición" },
  { value: "1", label: "Primero" },
  { value: "2", label: "Segundo" },
  { value: "3", label: "Tercero" },
  { value: "4", label: "Cuarto" },
  { value: "5", label: "Quinto" },
  { value: "6", label: "Sexto" },
  { value: "7", label: "Séptimo" },
  { value: "8", label: "Octavo" },
  { value: "9", label: "Noveno" },
  { value: "10", label: "Décimo" },
  { value: "11", label: "Once" },
];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AttendanceFeature({ teachers, groups }: Props) {
  const [teacher, setTeacher] = useState("");
  const [grade, setGrade] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState(getTodayDate);
  const [totalStudents, setTotalStudents] = useState("");
  const [boysPresent, setBoysPresent] = useState("");
  const [girlsPresent, setGirlsPresent] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formMessageIsError, setFormMessageIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const presentCount = Number(boysPresent || 0) + Number(girlsPresent || 0);
  const absentCount =
    totalStudents === "" ? null : Number(totalStudents) - presentCount;
  const exceedsTotal = absentCount !== null && absentCount < 0;

  const availableGroups = groups.filter((item) => item.gradeCode === grade);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !teacher ||
      !grade ||
      !group ||
      !date ||
      totalStudents === "" ||
      boysPresent === "" ||
      girlsPresent === ""
    ) {
      setFormMessage("Completa todos los campos para continuar.");
      setFormMessageIsError(true);
      return;
    }

    if (exceedsTotal) {
      setFormMessage("Los asistentes no pueden superar el total del grupo.");
      setFormMessageIsError(true);
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveAttendance({
        registeredByUserId: teacher,
        groupId: group,
        date,
        totalStudents: Number(totalStudents),
        boysPresent: Number(boysPresent),
        girlsPresent: Number(girlsPresent),
      });

      setFormMessage(result.message);
      setFormMessageIsError(!result.success);

      if (result.success) {
        setTeacher("");
        setGrade("");
        setGroup("");
        setTotalStudents("");
        setBoysPresent("");
        setGirlsPresent("");
      }
    } catch {
      setFormMessage("No fue posible guardar la asistencia. Inténtalo de nuevo.");
      setFormMessageIsError(true);
    } finally {
      setIsSaving(false);
    }
  }

  function clearMessage() {
    if (formMessage) {
      setFormMessage("");
      setFormMessageIsError(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex-1 overflow-y-auto bg-background pb-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-7 sm:py-10 lg:px-12 lg:py-14">
        <header className="mb-6 flex items-start justify-between gap-4 sm:mb-8 lg:mb-10">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary">
              CONTROL ESCOLAR <span className="px-1 text-text-muted">/</span> ASISTENCIA
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
              Asistencia diaria
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Registro de grupo · Jornada escolar
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card-bg px-3 py-2 text-sm font-semibold text-primary">
            <IconCalendarToday className="size-4" />
            <time dateTime={date}>
              {new Intl.DateTimeFormat("es-CO", {
                day: "numeric",
                month: "short",
              }).format(new Date(`${date}T12:00:00`))}
            </time>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid overflow-visible rounded-xl border border-border bg-card-bg shadow-sm lg:grid-cols-2"
        >
          <section className="border-b border-border p-5 sm:p-7 lg:border-r lg:border-b-0 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-text-main">Grupo y docente</h2>
                <p className="text-xs text-text-muted">Datos de la jornada</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-text-main">
                  Docente
                </span>
                <CustomSelect
                  value={teacher}
                  onChange={(value) => {
                    setTeacher(value);
                    clearMessage();
                  }}
                  icon={<IconAccountCircle className="size-5 text-primary" />}
                  options={[
                    { value: "", label: "Seleccionar docente" },
                    ...teachers.map(({ userId, name }) => ({
                      value: userId,
                      label: name,
                    })),
                  ]}
                />
              </label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-text-main">
                    Grado
                  </span>
                  <CustomSelect
                    value={grade}
                    onChange={(value) => {
                      setGrade(value);
                      setGroup("");
                      clearMessage();
                    }}
                    icon={<IconSchool className="size-5 text-primary" />}
                    options={[
                      { value: "", label: "Seleccionar" },
                      ...grades,
                    ]}
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-text-main">
                    Grupo
                  </span>
                  <CustomSelect
                    value={group}
                    onChange={(value) => {
                      setGroup(value);
                      clearMessage();
                    }}
                    icon={<IconGroup className="size-5 text-primary" />}
                    options={[
                      {
                        value: "",
                        label:
                          grade && availableGroups.length === 0
                            ? "Sin grupos disponibles"
                            : "Seleccionar grupo",
                      },
                      ...availableGroups.map(({ id, number }) => ({
                        value: id,
                        label: `Grupo ${number}`,
                      })),
                    ]}
                    disabled={!grade || availableGroups.length === 0}
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-text-main">
                  Fecha
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    clearMessage();
                  }}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-card-bg px-3 text-sm font-medium text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
            </div>
          </section>

          <section className="border-t border-border p-5 sm:p-7 lg:border-t-0 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-text-main">Conteo de estudiantes</h2>
                <p className="text-xs text-text-muted">
                  Registra quienes asistieron hoy
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <label className="col-span-2 block space-y-1.5">
                <span className="text-sm font-semibold text-text-main">
                  Total de estudiantes
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={totalStudents}
                  onChange={(event) => {
                    setTotalStudents(event.target.value);
                    clearMessage();
                  }}
                  required
                  placeholder="Ej. 32"
                  className="h-12 w-full rounded-xl border border-border bg-card-bg px-3 text-lg font-semibold text-text-main outline-none transition placeholder:text-text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="min-h-10 text-sm font-semibold leading-5 text-text-main">
                  Niños presentes
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  max={totalStudents || undefined}
                  inputMode="numeric"
                  value={boysPresent}
                  onChange={(event) => {
                    setBoysPresent(event.target.value);
                    clearMessage();
                  }}
                  required
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-primary/20 bg-primary/5 px-3 text-xl font-bold text-primary outline-none transition placeholder:text-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="min-h-10 text-sm font-semibold leading-5 text-text-main">
                  Niñas presentes
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  max={totalStudents || undefined}
                  inputMode="numeric"
                  value={girlsPresent}
                  onChange={(event) => {
                    setGirlsPresent(event.target.value);
                    clearMessage();
                  }}
                  required
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-secondary/40 bg-secondary/10 px-3 text-xl font-bold text-text-main outline-none transition placeholder:text-text-muted/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-background">
              <div className="bg-card-bg px-4 py-3">
                <p className="text-xs font-medium text-text-muted">Asistieron</p>
                <p className="mt-0.5 text-xl font-bold text-primary">
                  {presentCount}
                </p>
              </div>
              <div className="bg-card-bg px-4 py-3">
                <p className="text-xs font-medium text-text-muted">Faltantes</p>
                <p className="mt-0.5 text-xl font-bold text-basico">
                  {absentCount === null ? "—" : Math.max(0, absentCount)}
                </p>
              </div>
            </div>

            {exceedsTotal && (
              <p className="mt-3 text-sm font-medium text-bajo" role="alert">
                La suma de niños y niñas supera el total de estudiantes.
              </p>
            )}
          </section>

          <div className="col-span-full border-t border-border p-5 sm:px-7 sm:py-5 lg:px-8">
            {formMessage && (
              <p
                className={`mb-3 text-sm font-medium ${formMessageIsError ? "text-bajo" : "text-primary"}`}
                role={formMessageIsError ? "alert" : "status"}
                aria-live="polite"
              >
                {formMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 active:translate-y-px cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              {isSaving ? "Guardando asistencia..." : "Registrar asistencia"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
