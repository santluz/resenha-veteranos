"use client";
import Image from "next/image";
interface Props { logoUrl?: string; nomeGrupo?: string; }
export default function HeroSection({ logoUrl, nomeGrupo }: Props) {
  const nome = nomeGrupo || "Combinado";
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:`repeating-linear-gradient(-55deg,transparent,transparent 60px,rgba(220,38,38,0.4) 60px,rgba(220,38,38,0.4) 80px)`}} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-red-700 opacity-10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {logoUrl && <div className="flex justify-center mb-6"><Image src={logoUrl} alt={`Logo ${nome}`} width={120} height={120} className="rounded-full border-4 border-red-600 shadow-2xl object-cover" unoptimized /></div>}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-red-600 bg-red-600/10">
          <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
          <span className="text-[#F5C518] text-xs font-semibold tracking-[0.2em] uppercase">Futebol Amador ao Vivo</span>
        </div>
        <h1 className="text-[clamp(3rem,12vw,8rem)] font-black uppercase leading-none text-white" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
          Resenha do<br /><span className="text-red-600">{nome}</span>
        </h1>
        <p className="mt-8 text-[#A0A0A0] text-lg max-w-2xl mx-auto">As histórias, entrevistas e melhores momentos depois do apito final.</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById("ultima-resenha")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Assistir Última Entrevista
          </button>
          <a href="#highlights" className="inline-flex items-center border border-[#333] hover:border-[#F5C518] text-[#A0A0A0] hover:text-[#F5C518] font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded transition-all">Ver Highlights</a>
        </div>
      </div>
    </section>
  );
}
