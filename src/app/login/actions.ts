"use server";
import { signIn } from "@/auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/",
    });
  } catch (error: any) {
    if (error.type === "CredentialsSignin" || error.message?.includes("CredentialsSignin")) {
      return "Credenciales inválidas.";
    }
    // Si es un error de redirect (que es normal en Auth.js), Next.js lo manejará.
    // En Next.js 15+, re-lanzar el error es necesario para que el redirect funcione.
    throw error;
  }
}
