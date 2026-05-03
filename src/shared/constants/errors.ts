type ErrorKey =
  | "REQUIRED_EMAIL"
  | "REQUIRED_PASSWORD"
  | "INVALID_EMAIL"
  | "INVALID_CREDENTIALS";

export const ERROR_MESSAGES: Record<ErrorKey, string> = {
  REQUIRED_EMAIL: "Ingresa un correo",
  REQUIRED_PASSWORD: "Ingresa una contraseña",
  INVALID_EMAIL: "El correo es inválido",
  INVALID_CREDENTIALS: "El correo o la contraseña son incorrectos.\nVerifica tus credenciales.",
};