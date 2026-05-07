"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createParticipant(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const bandName = formData.get("bandName") as string;
  const songName = formData.get("songName") as string;
  const audioUrl = formData.get("audioUrl") as string;
  const description = formData.get("description") as string;

  await prisma.participant.create({
    data: { bandName, songName, audioUrl, description }
  });

  revalidatePath("/admin/participants");
  revalidatePath("/");
}

export async function deleteParticipant(id: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.participant.delete({ where: { id } });

  revalidatePath("/admin/participants");
  revalidatePath("/");
}
