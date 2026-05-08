"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SidebarMenu } from "@/components/SidebarMenu";

export function Navbar() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <nav className="bg-black/90 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(225,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo Principal - Arriba a la izquierda, dominante */}
        <div className="flex-shrink-0">
          <Link href="/" className="block relative h-12 w-40 sm:h-16 sm:w-56 transition-transform hover:scale-105">
            <Image
              src="/principal.png"
              alt="Cosquín Rock Radio"
              fill
              sizes="(max-width: 768px) 160px, 224px"
              className="object-contain object-left drop-shadow-[0_0_8px_rgba(225,0,0,0.5)]"
              priority
            />
          </Link>
        </div>

        {/* Lado derecho: Logo Secundario y Menú/Avatar */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <div className="relative h-8 w-20 sm:h-12 sm:w-32 opacity-90 hover:opacity-100 transition-opacity drop-shadow-md">
            <Image
              src="/secundario.png"
              alt="Cosquín Rock 2027"
              fill
              sizes="(max-width: 768px) 80px, 128px"
              className="object-contain object-right"
            />
          </div>
          
          <div className="h-8 border-l border-zinc-800"></div>

          <SidebarMenu user={{
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          }} />
        </div>
      </div>
    </nav>
  );
}
