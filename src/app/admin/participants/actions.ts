"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadToSupabase } from "@/lib/supabase";

export async function createParticipant(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const bandName = formData.get("bandName") as string;
  const songName = formData.get("songName") as string;
  const audioUrl = formData.get("audioUrl") as string;
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;

  let thumbnailUrl: string | null = null;
  if (file && file.size > 0) {
    try {
      thumbnailUrl = await uploadToSupabase(file);
    } catch (err: any) {
      console.error("Error uploading cover image:", err);
      throw new Error(err.message || "Error al subir la imagen de portada");
    }
  }

  await prisma.participant.create({
    data: { bandName, songName, audioUrl, description, thumbnailUrl }
  });

  revalidatePath("/admin/participants");
  revalidatePath("/");
}

export async function updateParticipantImage(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file || file.size === 0) {
    throw new Error("No se ha seleccionado ninguna imagen");
  }

  let thumbnailUrl: string;
  try {
    thumbnailUrl = await uploadToSupabase(file);
  } catch (err: any) {
    console.error("Error updating cover image:", err);
    throw new Error(err.message || "Error al subir la imagen de portada");
  }

  await prisma.participant.update({
    where: { id },
    data: { thumbnailUrl }
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
