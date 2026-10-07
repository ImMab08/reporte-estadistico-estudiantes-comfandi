"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import prisma from "@/src/lib/prisma";
import { verifySessionToken } from "@/src/lib/session";

type AttendanceInput = {
  registeredByUserId: string;
  groupId: string;
  date: string;
  totalStudents: number;
  boysPresent: number;
  girlsPresent: number;
};

type ActionResult = {
  success: boolean;
  message: string;
};

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function attendanceSnapshot(record: {
  groupId: string;
  registeredById: string;
  date: Date;
  totalStudents: number | null;
  boysPresent: number;
  girlsPresent: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    groupId: record.groupId,
    registeredById: record.registeredById,
    date: record.date.toISOString().slice(0, 10),
    totalStudents: record.totalStudents,
    boysPresent: record.boysPresent,
    girlsPresent: record.girlsPresent,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function saveAttendance(
  input: AttendanceInput,
): Promise<ActionResult> {
  const session = verifySessionToken((await cookies()).get("session")?.value);
  if (!session) {
    return { success: false, message: "Inicia sesión para registrar asistencia." };
  }

  if (!input || typeof input !== "object") {
    return { success: false, message: "Los datos del formulario no son válidos." };
  }

  const {
    registeredByUserId,
    groupId,
    date,
    totalStudents,
    boysPresent,
    girlsPresent,
  } = input;

  if (
    typeof registeredByUserId !== "string" ||
    !registeredByUserId ||
    typeof groupId !== "string" ||
    !groupId ||
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !isCount(totalStudents) ||
    !isCount(boysPresent) ||
    !isCount(girlsPresent)
  ) {
    return { success: false, message: "Completa todos los campos correctamente." };
  }

  const attendanceDate = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(attendanceDate.getTime()) ||
    attendanceDate.toISOString().slice(0, 10) !== date
  ) {
    return { success: false, message: "La fecha seleccionada no es válida." };
  }

  if (boysPresent + girlsPresent > totalStudents) {
    return {
      success: false,
      message: "Los asistentes no pueden superar el total del grupo.",
    };
  }

  const activeYear = await prisma.academicYear.findFirst({
    where: { active: true },
    orderBy: { year: "desc" },
    select: { id: true },
  });

  if (!activeYear) {
    return {
      success: false,
      message: "No hay un año académico activo para registrar asistencia.",
    };
  }

  const [teacher, group] = await Promise.all([
    prisma.teacher.findFirst({
      where: {
        userId: registeredByUserId,
        active: true,
        user: { active: true },
      },
      select: { userId: true },
    }),
    prisma.group.findFirst({
      where: { id: groupId, academicYearId: activeYear.id },
      select: { id: true },
    }),
  ]);

  if (!teacher || !group) {
    return {
      success: false,
      message: "El docente o el grupo seleccionado ya no está disponible.",
    };
  }

  const data = {
    groupId: group.id,
    registeredById: teacher.userId,
    date: attendanceDate,
    totalStudents,
    boysPresent,
    girlsPresent,
  };

  try {
    const wasUpdated = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.attendance.findUnique({
        where: {
          groupId_date: { groupId: group.id, date: attendanceDate },
        },
      });

      const attendance = existing
        ? await transaction.attendance.update({
            where: { id: existing.id },
            data,
          })
        : await transaction.attendance.create({ data });

      await transaction.auditLog.create({
        data: {
          userId: null,
          action: existing ? "UPDATE" : "CREATE",
          entity: "Attendance",
          entityId: attendance.id,
          oldValue: existing ? attendanceSnapshot(existing) : undefined,
          newValue: attendanceSnapshot(attendance),
        },
      });

      return Boolean(existing);
    });

    revalidatePath("/attendance");
    return {
      success: true,
      message: wasUpdated
        ? "El registro de asistencia fue actualizado."
        : "La asistencia quedó registrada correctamente.",
    };
  } catch {
    return {
      success: false,
      message: "No fue posible guardar la asistencia. Inténtalo de nuevo.",
    };
  }
}