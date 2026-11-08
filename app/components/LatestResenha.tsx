import type { LatestResenha as T } from "@/types";
interface Props { data: T; }
export default function LatestResenha({ data }: Props) {
  const date = new Date(data.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <section id="ultima-resenha" className="bg-[#111] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12"><span className="text-red-500 text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>🎙 Última Entrevista</span><div className="flex-1 h-px bg-[#222]" /><span className="text-xs text-[#444] uppercase">{date}</span></div>
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3"><div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0D0D0D] border border-[#222]">{data.videoUrl ? <video src={data.videoUrl} controls playsInline className="absolute inset-0 w-full h-full object-cover" /> : <iframe src={`https://www.youtube.com/embed/${data.youtubeId}?rel=0`} title={data.title} allowFullScreen className="absolute inset-0 w-full h-full" loading="lazy" />}</div></div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4"><span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">{data.matchStats.goals}</span><span className="text-[#555] text-xs">vs {data.matchStats.opponent}</span></div>
            <h2 className="text-white text-3xl font-black uppercase leading-tight mb-4" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>{data.title}</h2>
            <p className="text-[#888] leading-relaxed mb-8">{data.description}</p>
            {data.youtubeId && !data.videoUrl && <a href={`https://youtube.com/watch?v=${data.youtubeId}`} target="_blank" rel="noopener noreferrer" className="text-[#F5C518] hover:text-white text-sm font-semibold uppercase tracking-widest transition-colors">Abrir no YouTube →</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
