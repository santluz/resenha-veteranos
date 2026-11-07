interface Props { nomeGrupo?: string; }
export default function AboutProject({ nomeGrupo }: Props) {
  const nome = nomeGrupo || "Combinado";
  return (
    <section id="sobre" className="bg-[#0D0D0D] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-12"><div className="flex-1 h-px bg-[#1C1C1C]" /><span className="text-white text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>⚽ Sobre</span><div className="flex-1 h-px bg-[#1C1C1C]" /></div>
        <blockquote className="text-[#C0C0C0] text-xl leading-relaxed font-light italic mb-8">"A Resenha do {nome} nasceu para registrar os bastidores, entrevistas e momentos especiais do futebol entre amigos."</blockquote>
        <div className="w-16 h-1 bg-[#F5C518] rounded mx-auto" />
      </div>
    </section>
  );
}
