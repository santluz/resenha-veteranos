import type { NextMatch as T } from "@/types";
interface Props { match: T; }
export default function NextMatch({ match }: Props) {
  const date = new Date(match.date + "T" + match.time + ":00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  return (
    <section id="proximo-jogo" className="bg-[#0D0D0D] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12"><span className="text-red-500 text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}>📅 Próximo Jogo</span><div className="flex-1 h-px bg-[#1C1C1C]" /></div>
        <div className="max-w-xl mx-auto bg-[#151515] border border-[#222] rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-600 via-[#F5C518] to-red-600" />
          <div className="p-8 flex flex-col gap-6">
            {[{icon:"📅",label:"Data",value:date},{icon:"🕐",label:"Horário",value:match.time+"h"},{icon:"📍",label:"Local",value:match.location}].map(i => (
              <div key={i.label} className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-xl flex-shrink-0">{i.icon}</div><div><p className="text-[#555] text-xs uppercase tracking-widest mb-0.5">{i.label}</p><p className="text-white font-semibold capitalize">{i.value}</p></div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
