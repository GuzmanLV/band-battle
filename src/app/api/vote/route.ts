import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Permitir votar solo si está autorizado o es ADMIN
  if (!session.user.isAuthorized && session.user.role !== "ADMIN") {
     return NextResponse.json({ error: "No tienes permiso para votar. Contacta al administrador." }, { status: 403 });
  }

  const body = await req.json();
  const { participantId, score } = body;

  // Validación estricta backend (anti-manipulación)
  if (!participantId || typeof participantId !== "string") {
    return NextResponse.json({ error: "Banda no especificada o inválida" }, { status: 400 });
  }

  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 10) {
    return NextResponse.json({ error: "Puntuación inválida (debe ser un entero del 1 al 10)" }, { status: 400 });
  }

  try {
    // Verificar que la banda realmente existe
    const participantExists = await prisma.participant.findUnique({
      where: { id: participantId }
    });

    if (!participantExists) {
      return NextResponse.json({ error: "La banda especificada no existe" }, { status: 404 });
    }

    const vote = await prisma.vote.create({
      data: {
        score,
        participantId,
        userId: session.user.id
      }
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ya votaste por esta banda o ocurrió un error." }, { status: 500 });
  }
}
