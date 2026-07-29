import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";
import { VotingForm } from "./VotingForm";

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const participant = await prisma.participant.findUnique({
    where: { id }
  });

  if (!participant) return notFound();

  // Session is optional — page is public, voting is exclusive to judges
  const session = await getServerSession(authOptions);
  const isJudge =
    session?.user &&
    (session.user.isAuthorized || session.user.role === "ADMIN");

  // Only fetch existing vote if the user is a judge (avoids unnecessary DB call)
  const existingVote = isJudge
    ? await prisma.vote.findUnique({
        where: {
          userId_participantId: {
            userId: session!.user.id,
            participantId: participant.id,
          },
        },
      })
    : null;

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      {/* 1. Botón Volver */}
      <Link
        href="/"
        className="text-zinc-400 hover:text-white uppercase text-xs font-bold tracking-widest mb-6 inline-block transition-colors"
      >
        ← Volver al inicio
      </Link>

      {/* 2. Imagen de portada destacada */}
      <div className="w-full rounded-2xl overflow-hidden mb-8 border border-border shadow-[0_0_30px_rgba(225,0,0,0.1)] bg-zinc-900">
        {participant.thumbnailUrl ? (
          <div className="w-full aspect-video sm:aspect-[21/9]">
            <img
              src={participant.thumbnailUrl}
              alt={`Portada de ${participant.bandName}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-video sm:aspect-[21/9] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950 flex flex-col items-center justify-center gap-4">
            <span className="text-6xl sm:text-8xl filter drop-shadow-[0_0_16px_rgba(225,0,0,0.5)]">🎸</span>
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Sin imagen de portada</span>
          </div>
        )}
      </div>

      {/* 3 & 4. Nombre de banda y canción */}
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest drop-shadow-[0_0_10px_rgba(225,0,0,0.3)] text-white leading-tight">
          {participant.bandName}
        </h1>
        <h2 className="text-lg sm:text-xl text-primary mt-2 font-bold tracking-wider">
          {participant.songName}
        </h2>
      </div>

      {/* 5. Reproductor */}
      <div className="mb-8">
        <AudioPlayer audioUrl={participant.audioUrl} />
      </div>

      {/* 6. Descripción / Información de la banda */}
      {participant.description && (
        <div className="bg-card/50 p-6 rounded-xl border border-border/50 mb-2">
          <h3 className="text-sm text-zinc-500 uppercase tracking-widest mb-3 font-bold">Acerca de la banda</h3>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {participant.description}
          </p>
        </div>
      )}

      {/* 7. Panel de votación (jueces) o tarjeta informativa (visitantes) */}
      {isJudge ? (
        <VotingForm participantId={participant.id} initialVote={existingVote?.score} />
      ) : (
        <div className="mt-10 bg-card border border-border/50 rounded-2xl p-8 sm:p-10 text-center">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
            🎵
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-white mb-3">
            Escuchando Band Battle
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
            Disfrutá la música de las bandas participantes.<br />
            La votación está reservada únicamente para el jurado oficial.
          </p>
        </div>
      )}
    </main>
  );
}
