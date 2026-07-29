"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface User {
  email?: string | null;
  image?: string | null;
  role: string;
}

export function SidebarMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client before using createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawerContent = (
    <>
      {/* Overlay oscuro — renderizado en el portal, fuera del Navbar */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 200 }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar / Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-[#09090b] border-l border-zinc-800 shadow-[-10px_0_30px_rgba(225,0,0,0.1)] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 201 }}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
            <h3 className="text-white font-black tracking-widest uppercase">Menú</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white text-2xl font-light focus:outline-none"
              aria-label="Cerrar menú"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-zinc-300 hover:text-primary uppercase text-sm font-bold tracking-widest transition-colors"
            >
              Bandas
            </Link>
            <Link
              href="/metrics"
              onClick={() => setIsOpen(false)}
              className="text-zinc-300 hover:text-primary uppercase text-sm font-bold tracking-widest transition-colors"
            >
              Métricas y Resultados
            </Link>

            {user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/participants"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-300 hover:text-primary uppercase text-sm font-bold tracking-widest transition-colors"
                >
                  Admin: Bandas
                </Link>
                <Link
                  href="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-300 hover:text-primary uppercase text-sm font-bold tracking-widest transition-colors"
                >
                  Admin: Usuarios
                </Link>
              </>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {user.image ? (
                  <Image src={user.image} alt="User avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-zinc-400 uppercase tracking-widest truncate">{user.email}</p>
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">{user.role}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-xs font-bold py-3 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Botón de apertura (Avatar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 hover:border-primary transition-colors focus:outline-none"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <Image src={user.image} alt="User avatar" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </button>

      {/* Portal: renderizar overlay y drawer fuera del árbol del Navbar */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
