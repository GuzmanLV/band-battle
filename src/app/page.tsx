import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAuthorized && session?.user?.role !== "ADMIN") {
    return (
      <main className="flex-1 p-4 flex flex-col items-center justify-center max-w-lg mx-auto text-center h-full min-h-[60vh]">
        <div className="bg-card border border-primary/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(225,0,0,0.15)] w-full">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
            Acceso Denegado
          </h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Tu cuenta de Google (<b>{session?.user?.email}</b>) ha iniciado sesión, pero no estás en la lista de jueces invitados. Contacta al administrador del evento.
          </p>
          <LogoutButton />
        </div>
      </main>
    );
  }

  const participants = await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(225,0,0,0.5)]">
          Bandas
        </h1>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
        {participants.map((band: any) => (
          <Link href={`/participant/${band.id}`} key={band.id} className="group">
            <div className="aspect-square bg-card border border-border rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 sm:p-4 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(225,0,0,0.3)] group-hover:-translate-y-1">
              <h3 className="text-center font-bold text-lg sm:text-xl uppercase tracking-wider line-clamp-3 group-hover:text-primary transition-colors px-1 sm:px-2">
                {band.bandName}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      
      {participants.length === 0 && (
        <div className="text-zinc-500 text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <p className="uppercase tracking-widest font-bold">No hay bandas registradas aún.</p>
        </div>
      )}
    </main>
  );
}
