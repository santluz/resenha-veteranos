"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
interface Props { instagram: string; logoUrl?: string; nomeGrupo?: string; }
export default function Navbar({ instagram, logoUrl, nomeGrupo }: Props) {
  const [scrolled, setScrolled] = useState(false); const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ label: "Última Entrevista", href: "#ultima-resenha" }, { label: "Highlights", href: "#highlights" }, { label: "Árbitro 👁", href: "#arbitro" }, { label: "Entrevistas", href: "#entrevistas" }, { label: "Galeria", href: "#galeria" }, { label: "Próximo Jogo", href: "#proximo-jogo" }];
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#1C1C1C] shadow-lg" : "bg-transparent"}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          {logoUrl ? <Image src={logoUrl} alt="Logo" width={36} height={36} className="rounded-full object-cover" unoptimized /> : <span className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">⚽</span>}
          <span className="text-white font-black uppercase text-lg group-hover:text-red-500 transition-colors" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>Resenha</span>
        </a>
        <ul className="hidden md:flex items-center gap-5">{links.map(l => <li key={l.label}><a href={l.href} className="text-[#666] hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors">{l.label}</a></li>)}</ul>
        <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-[#888] hover:text-[#F5C518] text-xs font-bold uppercase tracking-widest transition-colors">Instagram</a>
        <button className="md:hidden text-[#888] hover:text-white p-1" onClick={() => setMenuOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </nav>
      {menuOpen && <div className="md:hidden bg-[#0D0D0D]/98 backdrop-blur-md border-b border-[#1C1C1C]"><ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">{links.map(l => <li key={l.label}><a href={l.href} onClick={() => setMenuOpen(false)} className="text-[#888] hover:text-white text-sm font-semibold uppercase block py-2 border-b border-[#1C1C1C] last:border-0">{l.label}</a></li>)}<li><a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#F5C518] text-sm font-semibold uppercase block py-2">@{instagram}</a></li></ul></div>}
    </header>
  );
}
