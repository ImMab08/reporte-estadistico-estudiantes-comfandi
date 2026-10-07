import { createHmac, timingSafeEqual } from "node:crypto";
import type { Nivel, Role } from "@/src/lib/user";

export type SessionUser = {
  email: string;
  name?: string;
  role: Role;
  niveles: Nivel[];
};

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const roles = new Set<Role>([
  "admin",
  "docente",
  "administrador",
  "administradora",
  "administrativo",
  "coordinadora",
  "coordinador",
  "rector",
  "psicologa",
]);

const levels = new Set<Nivel>([
  "preescolar",
  "primaria",
  "secundaria",
  "consejo",
  "todos",
]);

function getSigningSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.DATABASE_URL;

  if (!secret) {
    throw new Error("AUTH_SECRET o DATABASE_URL debe estar configurada.");
  }

  return secret;
}

function signatureFor(payload: string) {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(user: SessionUser) {
  const payload = Buffer.from(
    JSON.stringify({
      user,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${signatureFor(payload)}`;
}

export function verifySessionToken(token?: string): SessionUser | null {
  if (!token) return null;

  const [payload, signature, ...extraParts] = token.split(".");
  if (!payload || !signature || extraParts.length > 0) return null;

  try {
    const expectedSignature = Buffer.from(signatureFor(payload), "base64url");
    const receivedSignature = Buffer.from(signature, "base64url");

    if (
      expectedSignature.length !== receivedSignature.length ||
      !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return null;
    }

    const decoded: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (typeof decoded !== "object" || decoded === null) return null;

    const session = decoded as {
      expiresAt?: unknown;
      user?: {
        email?: unknown;
        name?: unknown;
        role?: unknown;
        niveles?: unknown;
      };
    };
    const user = session.user;

    if (
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now() ||
      !user ||
      typeof user.email !== "string" ||
      typeof user.role !== "string" ||
      !roles.has(user.role as Role) ||
      !Array.isArray(user.niveles) ||
      !user.niveles.every(
        (level): level is Nivel =>
          typeof level === "string" && levels.has(level as Nivel),
      ) ||
      (user.name !== undefined && typeof user.name !== "string")
    ) {
      return null;
    }

    return {
      email: user.email,
      name: user.name,
      role: user.role as Role,
      niveles: user.niveles,
    };
  } catch {
    return null;
  }
}