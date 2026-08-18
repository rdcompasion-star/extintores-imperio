import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { SessionOptions } from "iron-session";

const dataDir = path.join(process.cwd(), "data");
const secretPath = path.join(dataDir, "session-secret.txt");

function getSessionSecret(): string {
  // En producción (Vercel) el filesystem es efímero/de solo lectura: la clave
  // de sesión debe venir de una variable de entorno, o cada arranque generaría
  // una clave distinta y cerraría la sesión de todos.
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(secretPath)) {
      return fs.readFileSync(secretPath, "utf8").trim();
    }
    const secret = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(secretPath, secret, "utf8");
    return secret;
  } catch {
    // Filesystem no escribible y sin SESSION_SECRET: genera una clave que
    // sobrevive mientras el proceso viva (mejor que fallar el arranque).
    return crypto.randomBytes(32).toString("hex");
  }
}

export interface SessionData {
  isLoggedIn?: boolean;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password: getSessionSecret(),
  cookieName: "eimp_admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },
};
