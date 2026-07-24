"use client";

import { useTransition } from "react";
import { updateParticipantImage } from "./actions";

interface UploadImageButtonProps {
  id: string;
  hasImage: boolean;
}

export function UploadImageButton({ id, hasImage }: UploadImageButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    startTransition(async () => {
      try {
        await updateParticipantImage(id, formData);
      } catch (err: any) {
        alert(err.message || "Error al subir la imagen");
      }
    });
  };

  return (
    <label 
      className={`cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 hover:border-primary text-zinc-300 hover:text-white uppercase tracking-widest text-[10px] font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 select-none ${
        isPending ? "opacity-50 cursor-wait pointer-events-none" : ""
      }`}
    >
      <span>{isPending ? "Cargando..." : hasImage ? "Cambiar Portada" : "Subir Portada"}</span>
      <input
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={isPending}
      />
    </label>
  );
}
