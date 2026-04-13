import Image from "next/image";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthMosaic } from "@/components/auth/AuthMosaic";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full">
      <AuthMosaic />
      <section className="w-full lg:w-1/2 flex items-center justify-center bg-card p-8 lg:p-24">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 flex items-center gap-2.5">
            <Image
              src="/plan-selector-logo.svg"
              alt="Logo"
              width={32}
              height={32}
            />
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              Cotizador de Planes
            </span>
          </div>
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground tracking-tight">
              Crea tu cuenta
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              Empieza a encontrar el mejor plan para tus necesidades.
            </p>
          </div>
          <RegisterForm />
          <div className="mt-12 text-center">
            <p className="text-muted-foreground font-medium">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2"
              >
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
