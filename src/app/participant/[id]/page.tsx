import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";
import { VotingForm } from "./VotingForm";

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { id } = await params;

  const participant = await prisma.participant.findUnique({
    where: { id }
  });

  if (!participant) return notFound();

  // Check if user already voted
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_participantId: {
        userId: session.user.id,
        participantId: participant.id
      }
    }
  });

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <Link href="/" className="text-zinc-400 hover:text-white uppercase text-xs font-bold tracking-widest mb-8 inline-block transition-colors">
        ← Volver al inicio
      </Link>
      
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase tracking-widest drop-shadow-[0_0_10px_rgba(225,0,0,0.3)] text-white">
          {participant.bandName}
        </h1>
        <h2 className="text-xl text-primary mt-2 font-bold tracking-wider">
          {participant.songName}
        </h2>
      </div>

      <div className="mb-10">
        <AudioPlayer audioUrl={participant.audioUrl} />
      </div>

      {participant.description && (
        <div className="bg-card/50 p-6 rounded-xl border border-border/50">
          <h3 className="text-sm text-zinc-500 uppercase tracking-widest mb-3 font-bold">Acerca de la banda</h3>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {participant.description}
          </p>
        </div>
      )}

      <VotingForm participantId={participant.id} initialVote={existingVote?.score} />
    </main>
  );
}
