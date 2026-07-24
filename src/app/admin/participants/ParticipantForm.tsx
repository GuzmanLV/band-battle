"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createParticipant } from "./actions";

export function ParticipantForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createParticipant(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <Input name="bandName" label="Nombre de la Banda" required />
      <Input name="songName" label="Nombre de la Canción" required />
      <Input name="audioUrl" label="URL del Audio (mp3, wav...)" required />
      <div className="flex flex-col w-full">
        <label className="mb-2 text-sm font-bold tracking-wide text-gray-300 uppercase">
          Imagen de Portada (Opcional)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 file:cursor-pointer"
        />
      </div>
      <div className="flex flex-col w-full">
        <label className="mb-2 text-sm font-bold tracking-wide text-gray-300 uppercase">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
        />
      </div>
      <Button type="submit" className="mt-2 w-full">
        Agregar Banda
      </Button>
    </form>
  );
}
