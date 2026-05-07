import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ParticipantForm } from "./ParticipantForm";
import { DeleteParticipantButton } from "./DeleteButton";

export default async function AdminParticipantsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/");

  const participants = await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-black mb-8 tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(225,0,0,0.5)]">
        Gestionar Bandas
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card border border-border p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-primary">Agregar Banda</h2>
            <ParticipantForm />
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          {participants.map((band: any) => (
            <div key={band.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-lg hover:border-primary/50 transition-colors">
              <div>
                <h3 className="font-bold text-lg uppercase tracking-wider">{band.bandName}</h3>
                <p className="text-sm text-zinc-400">{band.songName}</p>
              </div>
              <div className="flex gap-2">
                <DeleteParticipantButton id={band.id} />
              </div>
            </div>
          ))}
          {participants.length === 0 && <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4">No hay bandas registradas.</p>}
        </div>
      </div>
    </main>
  );
}
