"use client";
import { useState } from "react";
import Image from "next/image";
import type { Interview } from "@/types";
interface Props { interviews: Interview[]; }
function Modal({ iv, onClose }: { iv: Interview; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 z-10"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      <div className="relative mx-auto" style={{ width: "min(90vw,400px)", aspectRatio: "9/16", maxHeight: "85vh" }} onClick={e => e.stopPropagation()}>
        {iv.videoUrl ? <video src={iv.videoUrl} controls autoPlay playsInline className="w-full h-full rounded-2xl object-cover bg-black" /> : <iframe src={`https://www.youtube.com/embed/${iv.youtubeId}?autoplay=1&rel=0`} title={iv.name} allowFullScreen allow="autoplay" className="w-full h-full rounded-2xl" />}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl pointer-events-none"><p className="text-red-400 text-xs font-bold uppercase mb-1">{iv.role}</p><p className="text-white font-bold">{iv.name}</p></div>
      </div>
    </div>
  );
}
function Card({ iv }: { iv: Interview }) {
  const [show, setShow] = useState(false);
  const date = new Date(iv.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const thumb = iv.thumbnail || (iv.youtubeId ? `https://img.youtube.com/vi/${iv.youtubeId}/hqdefault.jpg` : null);
  return (
    <>
      <article className="group bg-[#151515] border border-[#222] rounded-lg overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden bg-[#0D0D0D]">
          {thumb ? <Image src={thumb} alt={iv.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 50vw" unoptimized={thumb.includes("youtube.com")} /> : <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl">🎙</span></div>}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center"><svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div>
          <div className="absolute top-3 left-3 bg-black/70 text-[#F5C518] text-xs px-2 py-1 rounded">{date}</div>
          {iv.videoUrl && <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">📱 vertical</div>}
        </div>
        <div className="p-5">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">{iv.role}</p>
          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#F5C518] transition-colors">{iv.name}</h3>
          <p className="text-[#666] text-sm mb-5 line-clamp-2">{iv.description}</p>
          <button onClick={() => { if (iv.videoUrl) setShow(true); else window.open(`https://youtube.com/watch?v=${iv.youtubeId}`, "_blank"); }} className="inline-flex items-center gap-2 bg-red-600/10 hover:bg-red-600 border border-red-600 text-red-500 hover:text-white text-xs font-bold uppercase px-4 py-2.5 rounded transition-all"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Assistir</button>
        </div>
      </article>
      {show && <Modal iv={iv} onClose={() => setShow(false)} />}
    </>
  );
}
export default function InterviewsGrid({ interviews }: Props) {
  return (
    <section id="entrevistas" className="bg-[#0D0D0D] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12"><span className="text-[#F5C518] text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>🎙 Entrevistas</span><div className="flex-1 h-px bg-[#1C1C1C]" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{interviews.map(iv => <Card key={iv.id} iv={iv} />)}</div>
      </div>
    </section>
  );
}
