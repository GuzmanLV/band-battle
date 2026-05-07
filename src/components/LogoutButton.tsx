"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs uppercase tracking-widest text-primary hover:text-white font-bold transition-colors"
    >
      Salir
    </button>
  );
}
