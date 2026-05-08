import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Fuerza rendering dinámico en todo el árbol de rutas.
// Esto evita que Next.js intente hacer prerender estático de páginas
// que dependen de Prisma/sesión (como /_not-found) durante el build en Vercel.
export const dynamic = "force-dynamic";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Band Battle | Rock Edition",
  description: "Plataforma de votación para concurso de bandas.",
};

import AuthProvider from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
