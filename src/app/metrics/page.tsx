import { prisma } from "@/lib/prisma";

export default async function MetricsPage() {

  const participants = await prisma.participant.findMany({
    include: {
      votes: true
    }
  });

  const ranked = participants.map((p: any) => {
    const totalVotes = p.votes.length;
    const avgScore = totalVotes > 0 
      ? p.votes.reduce((acc: number, v: any) => acc + v.score, 0) / totalVotes 
      : 0;
    return { ...p, totalVotes, avgScore };
  }).sort((a: any, b: any) => b.avgScore - a.avgScore);

  const getRankStyle = (idx: number) => {
    if (idx === 0) return "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] border-yellow-500/50 bg-yellow-500/10";
    if (idx === 1) return "text-zinc-300 drop-shadow-[0_0_10px_rgba(212,212,216,0.5)] border-zinc-300/50 bg-zinc-300/10";
    if (idx === 2) return "text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)] border-amber-600/50 bg-amber-600/10";
    return "text-zinc-600 border-border bg-card";
  };

  const getRankLabel = (idx: number) => {
    if (idx === 0) return "1º";
    if (idx === 1) return "2º";
    if (idx === 2) return "3º";
    return `${idx + 1}º`;
  };

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(225,0,0,0.5)] text-center">
        Ranking Oficial
      </h1>

      <div className="flex flex-col gap-4">
        {ranked.map((band: any, idx: number) => {
          const isTop3 = idx < 3;
          
          return (
            <div 
              key={band.id} 
              className={`relative overflow-hidden border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 gap-4 transition-all duration-500 hover:scale-[1.01] ${
                isTop3 ? 'shadow-lg' : 'bg-card/50 shadow-sm'
              } ${idx === 0 ? 'border-yellow-500/30' : idx === 1 ? 'border-zinc-400/30' : idx === 2 ? 'border-amber-700/30' : 'border-border'}`}
            >
              {/* Posición */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-2xl sm:text-3xl border ${getRankStyle(idx)}`}>
                {getRankLabel(idx)}
              </div>

              {/* Info de la banda */}
              <div className="flex-1 min-w-0 w-full">
                <h2 className={`font-black uppercase tracking-wider truncate ${isTop3 ? 'text-xl sm:text-2xl text-white' : 'text-lg text-zinc-300'}`}>
                  {band.bandName}
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm font-bold truncate mb-3">{band.songName}</p>
                
                {/* Barra de puntuación */}
                <div className="w-full bg-zinc-900 rounded-full h-2 sm:h-3 overflow-hidden border border-zinc-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-primary shadow-[0_0_10px_rgba(225,0,0,0.8)]'}`}
                    style={{ width: `${band.totalVotes > 0 ? (band.avgScore / 10) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Puntuación numérica */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                <div className="text-center sm:text-right">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Puntaje</p>
                  <p className={`text-3xl sm:text-4xl font-black ${isTop3 ? 'text-white' : 'text-zinc-400'}`}>
                    {band.totalVotes > 0 ? band.avgScore.toFixed(1) : '-'}
                  </p>
                </div>
                <div className="text-center sm:text-right ml-4 sm:ml-0 mt-0 sm:mt-2">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Votos</p>
                  <p className="text-lg font-bold text-zinc-400">{band.totalVotes}</p>
                </div>
              </div>
            </div>
          );
        })}

        {ranked.length === 0 && (
          <div className="text-zinc-500 font-bold tracking-widest uppercase border border-dashed border-zinc-800 p-12 sm:p-20 text-center rounded-3xl">
            No hay bandas registradas aún.
          </div>
        )}
      </div>
    </main>
  );
}
