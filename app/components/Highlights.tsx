"use client";
import { useState } from "react";
import type { Highlight } from "@/types";
interface Props { highlights: Highlight[]; }
function Card({ h }: { h: Highlight }) {
  const [playing, setPlaying] = useState(false);
  const thumb = h.thumbnail || (h.youtubeId ? `https://img.youtube.com/vi/${h.youtubeId}/hqdefault.jpg` : null);
  const date = new Date(h.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300">
      <div className="relative aspect-video bg-[#0D0D0D]">
        {playing && h.videoUrl ? <video src={h.videoUrl} controls autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          : playing && h.youtubeId ? <iframe src={`https://www.youtube.com/embed/${h.youtubeId}?autoplay=1&rel=0`} title={h.title} allowFullScreen allow="autoplay" className="absolute inset-0 w-full h-full" />
          : <>{thumb && <img src={thumb} alt={h.title} className="absolute inset-0 w-full h-full object-cover" />}<div className="absolute inset-0 bg-black/40 flex items-center justify-center"><button onClick={() => setPlaying(true)} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-xl transition-all hover:scale-110"><svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></button></div><div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded">Highlights</div></>}
      </div>
      <div className="p-4"><h3 className="text-white font-bold text-base mb-1">{h.title}</h3><p className="text-[#555] text-xs">{date}</p></div>
    </div>
  );
}
export default function Highlights({ highlights }: Props) {
  if (!highlights.length) return null;
  return (
    <section id="highlights" className="bg-[#111] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12"><span className="text-red-500 text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>🎯 Melhores Momentos</span><div className="flex-1 h-px bg-[#222]" /><span className="text-xs text-[#333] uppercase">{highlights.length} vídeo{highlights.length !== 1 ? "s" : ""}</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{highlights.map(h => <Card key={h.id} h={h} />)}</div>
      </div>
    </section>
  );
}
