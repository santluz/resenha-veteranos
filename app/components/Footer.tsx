interface Props { instagram: string; nomeGrupo?: string; }
export default function Footer({ instagram, nomeGrupo }: Props) {
  const nome = nomeGrupo || "Combinado";
  return (
    <footer className="bg-[#080808] border-t border-[#1C1C1C] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <h2 className="text-white text-3xl font-black uppercase" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>Resenha do<span className="text-red-600"> {nome}</span></h2>
          <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-bold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity">@{instagram}</a>
        </div>
        <div className="h-px bg-[#1C1C1C] mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#333] uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Resenha do {nome}. Todos os direitos reservados.</p>
          <p>Produção: <a href="https://github.com/santluz" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">Edson Santana</a></p>
        </div>
      </div>
    </footer>
  );
}
