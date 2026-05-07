"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function VotingForm({ participantId, initialVote }: { participantId: string, initialVote?: number }) {
  const [score, setScore] = useState<number | null>(initialVote || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVote = async () => {
    if (!score || initialVote) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, score }),
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Error al emitir el voto");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center mt-10">
      <h3 className="text-2xl font-black uppercase tracking-widest mb-6">
        {initialVote ? "Tu Puntuación" : "Emitir Voto"}
      </h3>
      
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-8 max-w-sm mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => !initialVote && setScore(num)}
            disabled={!!initialVote}
            className={`aspect-square rounded-lg font-bold text-lg sm:text-xl transition-all duration-300 flex items-center justify-center ${
              score === num
                ? "bg-primary text-white shadow-[0_0_15px_rgba(225,0,0,0.5)] scale-105 border-primary"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            } disabled:opacity-100 ${initialVote && score !== num ? "opacity-20 scale-95" : ""}`}
          >
            {num}
          </button>
        ))}
      </div>

      {!initialVote ? (
        <Button 
          size="lg" 
          onClick={handleVote} 
          disabled={!score || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Guardando..." : "Confirmar Voto"}
        </Button>
      ) : (
        <div className="inline-block border border-primary/30 bg-primary/10 text-primary px-6 py-3 rounded-lg font-bold tracking-widest text-sm uppercase">
          Voto Registrado
        </div>
      )}
    </div>
  );
}
