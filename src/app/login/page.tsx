"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Si ya está autenticado redirigiendo, muestra un spinner mínimo
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold animate-pulse">
          Redirigiendo...
        </p>
      </div>
    );
  }

  // Mostrar el formulario de login (incluso mientras carga la sesión)
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-[0_0_50px_rgba(225,0,0,0.1)]">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl text-primary font-black tracking-widest drop-shadow-[0_0_10px_rgba(225,0,0,0.8)]">
            BAND BATTLE
          </CardTitle>
          <p className="text-zinc-400 mt-2 text-sm tracking-widest uppercase">
            Acceso exclusivo jurados
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Button
            id="btn-google-login"
            size="lg"
            className="w-full text-lg tracking-widest"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Verificando..." : "Ingresar con Google"}
          </Button>
          <p className="text-xs text-center text-zinc-600 mt-4">
            Debes estar en la lista de invitados para poder votar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

