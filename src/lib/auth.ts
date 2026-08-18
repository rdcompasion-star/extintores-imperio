import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbGet, dbRun, logHistory } from "@/lib/db";
import { sessionOptions, type SessionData } from "@/lib/session-config";

const dataDir = path.join(process.cwd(), "data");

function ensureDataDir() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    return true;
  } catch {
    // En serverless (Vercel) el filesystem es de solo lectura fuera de /tmp.
    // No es un error: en ese entorno las credenciales se manejan por variable
    // de entorno (ADMIN_PASSWORD), no por archivo.
    return false;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session.isLoggedIn;
}

export async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) throw new Error("No autorizado.");
}

export async function login(username: string, password: string): Promise<boolean> {
  const row = await dbGet<{ id: number; username: string; password_hash: string }>(
    `SELECT * FROM admin_users WHERE username = ?`,
    [username]
  );
  if (!row) return false;

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) return false;

  const session = await getSession();
  session.isLoggedIn = true;
  session.username = row.username;
  await session.save();
  await logHistory("auth", row.id, `Inicio de sesión de "${row.username}".`, row.username);
  return true;
}

export async function verifyPassword(username: string, password: string): Promise<boolean> {
  const row = await dbGet<{ password_hash: string }>(
    `SELECT * FROM admin_users WHERE username = ?`,
    [username]
  );
  if (!row) return false;
  return bcrypt.compare(password, row.password_hash);
}

export async function logout() {
  const session = await getSession();
  const username = session.username;
  session.destroy();
  if (username) await logHistory("auth", null, `Cierre de sesión de "${username}".`, username);
}

export async function changePassword(username: string, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 10);
  await dbRun(`UPDATE admin_users SET password_hash = ? WHERE username = ?`, [hash, username]);
  await logHistory("auth", null, `Se cambió la contraseña de administrador.`, username);
}

export async function ensureAdminUser() {
  const count = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM admin_users`);
  if (count && count.c > 0) return;

  const username = "admin";
  const hasDataDir = ensureDataDir();

  // En producción (Vercel) el archivo local no sirve para recuperar la
  // contraseña entre despliegues: usa ADMIN_PASSWORD si está configurada.
  const envPassword = process.env.ADMIN_PASSWORD;
  const password = envPassword || crypto.randomBytes(6).toString("hex");
  const hash = await bcrypt.hash(password, 10);
  await dbRun(`INSERT INTO admin_users (username, password_hash) VALUES (?, ?)`, [username, hash]);
  await logHistory("auth", null, "Usuario administrador creado automáticamente.", "system");

  if (envPassword) {
    // eslint-disable-next-line no-console
    console.log(`Usuario administrador "${username}" creado usando ADMIN_PASSWORD.`);
    return;
  }

  const message = `Extintores Imperio — acceso al panel de administración\n\nUsuario:     ${username}\nContraseña:  ${password}\n\nEntra en /admin o presiona Ctrl+Shift+A en cualquier página del sitio.\nCambia esta contraseña desde Configuración una vez dentro.\n`;

  if (hasDataDir) {
    try {
      fs.writeFileSync(path.join(dataDir, "admin-credentials.txt"), message, "utf8");
    } catch {
      // filesystem de solo lectura; la contraseña queda solo en el log.
    }
  }
  // eslint-disable-next-line no-console
  console.log(
    `\n\x1b[41m\x1b[97m ADMIN CREADO \x1b[0m Usuario: ${username}  Contraseña: ${password}\n`
  );
}
