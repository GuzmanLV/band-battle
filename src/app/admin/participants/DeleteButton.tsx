"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteParticipant } from "./actions";

export function DeleteParticipantButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="danger"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("¿Estás seguro de eliminar esta banda? Se eliminarán también sus votos.")) {
          startTransition(() => {
            deleteParticipant(id);
          });
        }
      }}
    >
      {isPending ? "..." : "Eliminar"}
    </Button>
  );
}
