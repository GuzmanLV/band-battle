import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
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
