import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAuthorized && session?.user?.role !== "ADMIN") {
    return (
      <main className="flex-1 p-4 flex flex-col items-center justify-center max-w-md mx-auto text-center h-full min-h-[60vh]">
        <div className="bg-card border border-primary/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(225,0,0,0.15)] w-full">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🔒
          </div>
          <h1 className="text-xl font-black uppercase tracking-widest text-white mb-4 leading-snug">
            Acceso Denegado
          </h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Usted no forma parte del jurado autorizado para esta competencia.
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              href="/metrics" 
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(225,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,26,26,0.8)] flex items-center justify-center"
            >
              Volver al inicio
            </Link>
            <LogoutButton />
          </div>
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {participants.map((band: any) => (
          <Link href={`/participant/${band.id}`} key={band.id} className="group">
            <div className="flex flex-col gap-2.5 transition-all duration-300 group-hover:-translate-y-1">
              {/* Contenedor de Miniatura */}
              <div className="aspect-video w-full bg-zinc-900 border border-border rounded-xl sm:rounded-2xl overflow-hidden relative transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(225,0,0,0.3)]">
                {band.thumbnailUrl ? (
                  <img 
                    src={band.thumbnailUrl} 
                    alt={band.bandName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-4">
                    <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-[0_0_8px_rgba(225,0,0,0.4)]">🎸</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center line-clamp-1 px-2">
                      {band.bandName}
                    </span>
                  </div>
                )}
              </div>
              {/* Información de Banda */}
              <div className="px-1">
                <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider line-clamp-1 text-white group-hover:text-primary transition-colors">
                  {band.bandName}
                </h3>
                <p className="text-zinc-500 text-[11px] sm:text-xs font-semibold truncate mt-0.5">
                  {band.songName}
                </p>
              </div>
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
