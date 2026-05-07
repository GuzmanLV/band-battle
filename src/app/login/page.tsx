"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LoginPage() {
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
            size="lg"
            className="w-full text-lg tracking-widest"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Ingresar con Google
          </Button>
          <p className="text-xs text-center text-zinc-600 mt-4">
            Debes estar en la lista de invitados para poder votar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
