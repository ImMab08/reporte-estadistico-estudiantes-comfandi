import type { User } from "@/src/lib/user";

export function getUserFromCookie() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/user=([^;]+)/);
  if (!match) return null;

  let serialized = match[1];

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const parsed: unknown = JSON.parse(serialized);

      if (typeof parsed === "object" && parsed !== null) {
        const profile = parsed as {
          email?: unknown;
          name?: unknown;
          role?: unknown;
          niveles?: unknown;
        };

        if (
          typeof profile.email === "string" &&
          typeof profile.role === "string" &&
          Array.isArray(profile.niveles) &&
          profile.niveles.every((level) => typeof level === "string")
        ) {
          return {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : undefined,
            role: profile.role.toLocaleLowerCase("es"),
            niveles: profile.niveles.map((level) => level.toLocaleLowerCase("es")),
          } as User;
        }
      }
    } catch {
      try {
        serialized = decodeURIComponent(serialized);
      } catch {
        return null;
      }
    }
  }

  return null;
}