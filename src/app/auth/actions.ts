"use server";

import { cookies } from "next/headers";
import { randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/src/lib/prisma";
import { createSessionToken, SESSION_MAX_AGE_SECONDS, type SessionUser } from "@/src/lib/session";
import type { Nivel, Role } from "@/src/lib/user";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

const rolePriority: Role[] = [
  "admin",
  "administrador",
  "administradora",
  "administrativo",
  "coordinadora",
  "coordinador",
  "rector",
  "psicologa",
  "docente",
];

function resolveRole(roleNames: string[]): Role | null {
  const normalizedRoles = new Set(
    roleNames.map((role) => role.trim().toLocaleLowerCase("es")),
  );

  return rolePriority.find((role) => normalizedRoles.has(role)) ?? null;
}

function resolveTeacherLevels(gradeCodes: string[]): Nivel[] {
  const levels = new Set<Nivel>();

  for (const code of gradeCodes) {
    const normalizedCode = code.trim().toLocaleUpperCase("es");
    const gradeNumber = Number(normalizedCode);

    if (normalizedCode === "JARDIN" || normalizedCode === "TRANSICION") {
      levels.add("preescolar");
    } else if (Number.isInteger(gradeNumber) && gradeNumber >= 1 && gradeNumber <= 5) {
      levels.add("primaria");
    } else if (Number.isInteger(gradeNumber) && gradeNumber >= 6 && gradeNumber <= 11) {
      levels.add("secundaria");
    }
  }

  return [...levels];
}

function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (/^\$2[aby]\$\d{2}\$/.test(storedHash)) {
    return bcrypt.compare(password, storedHash);
  }

  const [algorithm, salt, encodedHash, ...extraParts] = storedHash.split(":");

  if (
    algorithm !== "scrypt" ||
    !salt ||
    !encodedHash ||
    extraParts.length > 0 ||
    !/^[\da-f]+$/i.test(encodedHash)
  ) {
    return Promise.resolve(false);
  }

  const expectedHash = Buffer.from(encodedHash, "hex");
  if (expectedHash.length !== 64) return Promise.resolve(false);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, expectedHash.length, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(timingSafeEqual(expectedHash, derivedKey));
    });
  });
}

export async function login(email: string, password: string) {
  if (
    typeof email !== "string" ||
    email.length > 320 ||
    typeof password !== "string" ||
    password.length > 4096
  ) {
    return { success: false };
  }

  const matchedUser = await prisma.user.findUnique({
    where: { username: email.trim().toLowerCase() },
    select: {
      username: true,
      fullName: true,
      passwordHash: true,
      active: true,
      roles: { select: { role: { select: { name: true } } } },
      teacher: {
        select: {
          subjectAssignments: {
            where: { active: true },
            select: { group: { select: { gradeLevel: { select: { code: true } } } } },
          },
          groupStaffAssignments: {
            where: { active: true },
            select: { group: { select: { gradeLevel: { select: { code: true } } } } },
          },
        },
      },
    },
  });

  if (
    !matchedUser ||
    !matchedUser.active
  ) {
    return { success: false };
  }

  const normalizedPassword = password.trim();
  if (!(await verifyPassword(normalizedPassword, matchedUser.passwordHash))) {
    return { success: false };
  }

  if (/^\$2[aby]\$\d{2}\$/.test(matchedUser.passwordHash)) {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `scrypt:${salt}:${scryptSync(normalizedPassword, salt, 64).toString("hex")}`;
    await prisma.user.update({
      where: { username: matchedUser.username },
      data: { passwordHash },
    });
  }

  const role = resolveRole(matchedUser.roles.map(({ role }) => role.name));
  if (!role) return { success: false };

  const teacherGradeCodes = [
    ...(matchedUser.teacher?.subjectAssignments ?? []).map(
      ({ group }) => group.gradeLevel.code,
    ),
    ...(matchedUser.teacher?.groupStaffAssignments ?? []).map(
      ({ group }) => group.gradeLevel.code,
    ),
  ];

  const sessionUser: SessionUser = {
    email: matchedUser.username,
    name: matchedUser.fullName,
    role,
    niveles:
      role === "docente"
        ? resolveTeacherLevels(teacherGradeCodes)
        : ["todos"],
  };
  const cookieStore = await cookies();
  const profileCookieOptions = { ...cookieOptions, httpOnly: false };

  cookieStore.set("session", createSessionToken(sessionUser), cookieOptions);
  cookieStore.set(
    "user",
    JSON.stringify(sessionUser),
    profileCookieOptions,
  );

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("user");
  redirect("/auth");
}
