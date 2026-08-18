"use server";

import { login as loginUser, logout as logoutUser } from "@/lib/auth";

export async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  const username = String(formData.get("username") ?? "admin");
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Ingresa tu contraseña." };
  }

  const ok = await loginUser(username, password);
  if (!ok) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  return { error: "" };
}

export async function logoutAction() {
  await logoutUser();
}
