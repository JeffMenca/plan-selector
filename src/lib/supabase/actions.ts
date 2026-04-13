"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Map of Supabase error messages to Spanish translations
const errorTranslations: Record<string, string> = {
  "Invalid login credentials":
    "Credenciales inválidas. Verifica tu email y contraseña.",
  "Email not confirmed":
    "Tu email aún no ha sido confirmado. Revisa tu bandeja de entrada.",
  "User not found": "Usuario no encontrado.",
  "Email already registered": "Este email ya está registrado.",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres.",
  "Invalid email format": "El formato del email no es válido.",
};

function translateError(message: string): string {
  // Try exact match first
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Try partial match
  for (const [key, translation] of Object.entries(errorTranslations)) {
    if (message.includes(key)) {
      return translation;
    }
  }

  // Fallback: return original message
  return message;
}

function getBaseUrl(headersList: Headers): string {
  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.SITE_URL;

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  const origin = headersList.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const forwardedHost = headersList.get("x-forwarded-host");
  const host = forwardedHost ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  // If email confirmation is not required, session is immediately available.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  // Email confirmation required — let the form display the pending message.
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
