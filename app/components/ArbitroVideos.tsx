"use client";
import { useState } from "react";
import type { ArbitroVideo } from "@/types";
interface Props { videos: ArbitroVideo[]; }
function VerticalPlayer({ video, onClose }: { video: ArbitroVideo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 z-10"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      <div className="relative mx-auto" style={{ width: "min(90vw, 400px)", aspectRatio: "9/16", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <video src={video.videoUrl} controls autoPlay playsInline className="w-full h-full rounded-2xl object-cover bg-black" style={{ maxHeight: "90vh" }} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 rounded-b-2xl pointer-events-none"><p className="text-yellow-400 text-xs font-bold uppercase mb-1">👁 Visão do Árbitro</p><p className="text-white font-bold">{video.title}</p></div>
      </div>
    </div>
  );
}
function ArbitroCard({ video }: { video: ArbitroVideo }) {
  const [show, setShow] = useState(false);
  const date = new Date(video.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <>
      <div className="group bg-[#151515] border border-[#222] rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setShow(true)}>
        <div className="relative overflow-hidden bg-[#0D0D0D]" style={{ aspectRatio: "9/16", maxHeight: "380px" }}>
          {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"><span className="text-5xl">🎥</span><p className="text-[#444] text-xs uppercase">Câmera de Ação</p></div>}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-xl"><svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div>
          <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-black uppercase px-2 py-1 rounded">👁 Árbitro</div>
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{date}</div>
        </div>
        <div className="p-4"><h3 className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">{video.title}</h3>{video.description && <p className="text-[#666] text-sm mt-1 line-clamp-2">{video.description}</p>}</div>
      </div>
      {show && <VerticalPlayer video={video} onClose={() => setShow(false)} />}
    </>
  );
}
export default function ArbitroVideos({ videos }: Props) {
  if (!videos.length) return null;
  return (
    <section id="arbitro" className="bg-[#0D0D0D] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4"><span className="text-yellow-500 text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>👁 Visão do Árbitro</span><div className="flex-1 h-px bg-[#1C1C1C]" /></div>
        <p className="text-[#555] text-sm mb-10">A partida pelos olhos de quem apita — câmera de ação no peito do árbitro.</p>
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">{videos.map(v => <ArbitroCard key={v.id} video={v} />)}</div>
      </div>
    </section>
  );
}
