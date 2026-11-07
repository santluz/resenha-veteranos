"use client";
import { useState } from "react";
import type { GalleryPhoto } from "@/types";
interface Props { photos: GalleryPhoto[]; }
function Lightbox({ photos, index, onClose }: { photos: GalleryPhoto[]; index: number; onClose: () => void }) {
  const [cur, setCur] = useState(index);
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 z-10"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      <button onClick={e => { e.stopPropagation(); setCur(i => i > 0 ? i-1 : photos.length-1); }} className="absolute left-4 text-white/60 hover:text-white p-3 rounded-full hover:bg-white/10 z-10"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      <div className="relative max-w-2xl w-full" style={{ maxHeight: "80vh" }} onClick={e => e.stopPropagation()}><img src={photos[cur].src} alt={photos[cur].alt} className="w-full h-full object-contain rounded-xl" style={{ maxHeight: "80vh" }} />{photos[cur].alt && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl"><p className="text-white/70 text-sm text-center">{photos[cur].alt}</p></div>}</div>
      <button onClick={e => { e.stopPropagation(); setCur(i => i < photos.length-1 ? i+1 : 0); }} className="absolute right-4 text-white/60 hover:text-white p-3 rounded-full hover:bg-white/10 z-10"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#555] text-xs">{cur+1} / {photos.length}</div>
    </div>
  );
}
export default function GameGallery({ photos }: Props) {
  const [idx, setIdx] = useState<number|null>(null);
  if (!photos.length) return null;
  return (
    <section id="galeria" className="bg-[#111] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12"><span className="text-white text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>📷 Galeria do Jogo</span><div className="flex-1 h-px bg-[#222]" /><span className="text-xs text-[#333] uppercase">{photos.length} foto{photos.length!==1?"s":""}</span></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{photos.map((p,i) => <button key={p.id} onClick={() => setIdx(i)} className="group relative aspect-square overflow-hidden rounded-lg bg-[#1C1C1C] cursor-zoom-in"><img src={p.src} alt={p.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></button>)}</div>
      </div>
      {idx !== null && <Lightbox photos={photos} index={idx} onClose={() => setIdx(null)} />}
    </section>
  );
}
