"use client";
import { useState, useEffect, useRef } from "react";
import { getLatestResenha, saveResenha, deleteResenha, getInterviews, addInterview, deleteInterview, getHighlights, addHighlight, deleteHighlight, getArbitroVideos, addArbitroVideo, deleteArbitroVideo, getGallery, addPhoto, deletePhoto, getNextMatch, saveNextMatch, getSiteConfig, saveSiteConfig } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { comprimirImagem } from "@/lib/imageUtils";
import { extractDominantColor } from "@/lib/extractColor";
import type { Interview, Highlight, ArbitroVideo, LatestResenha, GalleryPhoto, NextMatch, SiteConfig } from "@/types";

function ProgressBar({ pct, label }: { pct: number; label?: string }) { if (pct <= 0 || pct >= 100) return null; return <div className="mt-2"><div className="w-full bg-[#222] rounded-full h-2"><div className="bg-red-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} /></div><p className="text-[#555] text-xs mt-1">{label || `${pct}%`}</p></div>; }

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false);
  const go = () => { if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) { sessionStorage.setItem("admin_auth", "1"); onLogin(); } else { setErr(true); setTimeout(() => setErr(false), 2000); } };
  return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4"><div className="bg-[#151515] border border-[#222] rounded-2xl p-10 w-full max-w-sm text-center"><div className="text-4xl mb-4">⚽</div><h1 className="text-white font-black text-2xl uppercase mb-1" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>Painel Admin</h1><p className="text-[#555] text-sm mb-8">Resenha do Combinado</p><input type="password" placeholder="Senha" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} className={`w-full bg-[#0D0D0D] border rounded-lg px-4 py-3 text-white text-sm mb-4 outline-none ${err ? "border-red-500" : "border-[#333] focus:border-red-600"}`} />{err && <p className="text-red-400 text-xs mb-3">Senha incorreta</p>}<button onClick={go} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm py-3 rounded-lg">Entrar</button></div></div>;
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 mb-6"><h2 className="text-white font-black text-xl uppercase mb-6 flex items-center gap-2" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>{emoji} {title}</h2>{children}</div>;
}
function Input({ label, tip, ...props }: { label: string; tip?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div><label className="text-[#666] text-xs uppercase tracking-widest block mb-1">{label}</label><input {...props} className="w-full bg-[#0D0D0D] border border-[#333] focus:border-red-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors" />{tip && <p className="text-[#444] text-xs mt-1">{tip}</p>}</div>;
}
function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <div><label className="text-[#666] text-xs uppercase tracking-widest block mb-1">{label}</label><textarea {...props} className="w-full bg-[#0D0D0D] border border-[#333] focus:border-red-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors resize-none" /></div>;
}
function SaveBtn({ loading, label = "Salvar" }: { loading: boolean; label?: string }) {
  return <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg">{loading ? "Aguarde..." : label}</button>;
}
function UploadArea({ label, accept, multiple, onChange, preview, inputRef }: { label: string; accept: string; multiple?: boolean; onChange: (f: FileList | null) => void; preview?: string | null; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return <div><label className="text-[#666] text-xs uppercase tracking-widest block mb-1">{label}</label><button type="button" onClick={() => inputRef.current?.click()} className="w-full bg-[#0D0D0D] border-2 border-dashed border-[#333] hover:border-red-600 rounded-xl px-4 py-6 flex flex-col items-center gap-2 transition-colors group">{preview ? <img src={preview} alt="preview" className="w-24 h-16 object-cover rounded-lg mb-1" /> : <div className="w-12 h-12 rounded-full bg-red-600/10 group-hover:bg-red-600/20 flex items-center justify-center"><svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>}<span className="text-[#666] group-hover:text-red-500 text-sm">Toque para escolher</span></button><input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={e => onChange(e.target.files)} className="hidden" /></div>;
}

// ─── Identidade do Grupo ───────────────────────────────────────────────────────
function ConfigSection() {
  const [config, setConfig] = useState<SiteConfig>({ instagram: "", logoUrl: "", comunicado: "", comunicadoAtivo: false, nomeGrupo: "", primaryColor: "#dc2626" });
  const [loading, setLoading] = useState(false); const [logoLoading, setLogoLoading] = useState(false); const [extracting, setExtracting] = useState(false); const [saved, setSaved] = useState(false); const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  useEffect(() => { getSiteConfig().then(c => { setConfig({ primaryColor: "#dc2626", nomeGrupo: "", ...c }); if (c.logoUrl) setLogoPreview(c.logoUrl); }); }, []);

  const handleLogo = async (files: FileList | null) => {
    const f = files?.[0]; if (!f) return;
    setLogoLoading(true);
    setLogoPreview(URL.createObjectURL(f));
    const comp = await comprimirImagem(f, 400);
    const r = await uploadToCloudinary(comp);
    setExtracting(true);
    try { const cor = await extractDominantColor(r.url); setConfig(p => ({ ...p, logoUrl: r.url, primaryColor: cor.hex })); }
    catch { setConfig(p => ({ ...p, logoUrl: r.url })); }
    setExtracting(false); setLogoLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await saveSiteConfig(config);
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Identidade do Grupo" emoji="🎨">
      <p className="text-[#555] text-sm -mt-4 mb-6">Configure nome, logo, cor e Instagram. Para novo grupo: duplique o repositório, configure um novo Firebase/Cloudinary e preencha aqui.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Logo */}
        <div>
          <label className="text-[#666] text-xs uppercase tracking-widest block mb-2">Logo do Grupo</label>
          <div className="flex items-center gap-4">
            {logoPreview ? <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-red-600" /> : <div className="w-16 h-16 rounded-full bg-[#222] border-2 border-dashed border-[#444] flex items-center justify-center text-2xl">⚽</div>}
            <div>
              <button type="button" onClick={() => logoRef.current?.click()} disabled={logoLoading || extracting} className="bg-[#222] hover:bg-[#333] border border-[#444] text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg disabled:opacity-50 block mb-1">
                {logoLoading ? "Enviando..." : extracting ? "Extraindo cor..." : "Escolher Logo"}
              </button>
              <p className="text-[#444] text-xs">A cor principal é extraída automaticamente</p>
            </div>
            <input ref={logoRef} type="file" accept="image/*" onChange={e => handleLogo(e.target.files)} className="hidden" />
          </div>
        </div>

        {/* Nome do grupo */}
        <Input label="Nome do Grupo" value={config.nomeGrupo || ""} onChange={e => setConfig({ ...config, nomeGrupo: e.target.value })} placeholder="Ex: Veteranos FC, Os Crias, Pelotão..." tip='Aparece em: "Resenha do [Nome]", rodapé e seção Sobre' />

        {/* Cor primária */}
        <div>
          <label className="text-[#666] text-xs uppercase tracking-widest block mb-2">Cor Principal</label>
          <div className="flex items-center gap-4 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3">
            <input type="color" value={config.primaryColor || "#dc2626"} onChange={e => setConfig({ ...config, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
            <div><p className="text-white text-sm font-semibold">{config.primaryColor || "#dc2626"}</p><p className="text-[#444] text-xs">Extraída do logo · Clique para ajustar</p></div>
            <div className="ml-auto flex gap-2">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: config.primaryColor || "#dc2626" }} />
              <div className="w-8 h-8 rounded-full opacity-50" style={{ backgroundColor: config.primaryColor || "#dc2626" }} />
              <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: config.primaryColor || "#dc2626" }} />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <Input label="@ do Instagram" value={config.instagram} onChange={e => setConfig({ ...config, instagram: e.target.value.replace("@", "") })} placeholder="grupocombinadofutebol" />

        {/* Comunicado */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#666] text-xs uppercase tracking-widest">Comunicado</label>
            <div onClick={() => setConfig({ ...config, comunicadoAtivo: !config.comunicadoAtivo })} className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${config.comunicadoAtivo ? "bg-red-600" : "bg-[#333]"}`}><div className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${config.comunicadoAtivo ? "translate-x-4" : ""}`} /></div>
          </div>
          <textarea value={config.comunicado || ""} onChange={e => setConfig({ ...config, comunicado: e.target.value })} placeholder="Ex: Jogo cancelado por chuva!" rows={2} className="w-full bg-[#0D0D0D] border border-[#333] focus:border-red-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none resize-none" />
        </div>

        <div className="flex items-center gap-4">
          <SaveBtn loading={loading} label="Salvar Configurações" />
          {saved && <span className="text-green-500 text-sm">✓ Salvo! Recarregue o site para ver as mudanças.</span>}
        </div>
      </form>
    </Section>
  );
}

// ─── Última Entrevista ─────────────────────────────────────────────────────────
function ResenhaSection() {
  const [data, setData] = useState<LatestResenha>({ youtubeId: "", title: "", date: "", description: "", matchStats: { goals: "", opponent: "", location: "" } });
  const [resenhaId, setResenhaId] = useState<string | null>(null); const [videoFile, setVideoFile] = useState<File | null>(null); const [progress, setProgress] = useState(0); const [loading, setLoading] = useState(false); const [saved, setSaved] = useState(false); const [deleting, setDeleting] = useState(false); const [useYt, setUseYt] = useState(true);
  const videoRef = useRef<HTMLInputElement>(null);
  useEffect(() => { getLatestResenha().then(r => { if (r) { setData(r); setUseYt(!r.videoUrl); setResenhaId((r as any).id || null); } }); }, []);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); let d = { ...data }; if (!useYt && videoFile) { setProgress(1); const r = await uploadToCloudinary(videoFile, setProgress); d = { ...d, youtubeId: "", videoUrl: r.url }; } await saveResenha(d, resenhaId || undefined); setProgress(0); setVideoFile(null); setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleDelete = async () => { if (!confirm("Remover?")) return; if (!resenhaId) return; setDeleting(true); await deleteResenha(resenhaId); setData({ youtubeId: "", title: "", date: "", description: "", matchStats: { goals: "", opponent: "", location: "" } }); setResenhaId(null); setDeleting(false); };
  const temConteudo = !!resenhaId;
  return <Section title="Última Entrevista" emoji="🎬">
    {temConteudo && <div className="mb-6 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-[#555] text-xs uppercase mb-1">Atual</p><p className="text-white font-semibold text-sm">{data.title}</p><p className="text-[#555] text-xs mt-1">{data.date} · {data.videoUrl ? "📱 próprio" : `📺 ${data.youtubeId}`}</p></div><button onClick={handleDelete} disabled={deleting} className="bg-red-600/10 hover:bg-red-600 border border-red-600/50 text-red-500 hover:text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg transition-all disabled:opacity-50">{deleting ? "Removendo..." : "🗑 Deletar"}</button></div></div>}
    <div className="flex gap-3 mb-6">{["youtube", "upload"].map(m => <button key={m} type="button" onClick={() => setUseYt(m === "youtube")} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase border transition-colors ${(m === "youtube") === useYt ? "bg-red-600 border-red-600 text-white" : "bg-transparent border-[#333] text-[#666]"}`}>{m === "youtube" ? "📺 YouTube" : "📱 Celular"}</button>)}</div>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {useYt ? <div className="md:col-span-2"><Input label="ID do YouTube" tip="Parte depois de ?v=" value={data.youtubeId || ""} onChange={e => setData({ ...data, youtubeId: e.target.value })} placeholder="Ex: ABC123xyz" /></div> : <div className="md:col-span-2"><UploadArea label="Vídeo" accept="video/*" onChange={f => setVideoFile(f?.[0] || null)} inputRef={videoRef} preview={null} />{videoFile && <p className="text-red-400 text-xs mt-1">✓ {videoFile.name}</p>}<ProgressBar pct={progress} label={`Enviando... ${progress}%`} /></div>}
      <Input label="Título" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} required />
      <Input label="Data" type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} required />
      <Input label="Placar" value={data.matchStats.goals} onChange={e => setData({ ...data, matchStats: { ...data.matchStats, goals: e.target.value } })} placeholder="4 x 1" />
      <Input label="Adversário" value={data.matchStats.opponent} onChange={e => setData({ ...data, matchStats: { ...data.matchStats, opponent: e.target.value } })} />
      <div className="md:col-span-2"><Input label="Local" value={data.matchStats.location} onChange={e => setData({ ...data, matchStats: { ...data.matchStats, location: e.target.value } })} /></div>
      <div className="md:col-span-2"><Textarea label="Descrição" value={data.description} rows={3} onChange={e => setData({ ...data, description: e.target.value })} /></div>
      <div className="md:col-span-2 flex items-center gap-4"><SaveBtn loading={loading} label={temConteudo ? "Atualizar" : "Salvar"} />{saved && <span className="text-green-500 text-sm">✓ Salvo!</span>}</div>
    </form>
  </Section>;
}

// ─── Highlights ────────────────────────────────────────────────────────────────
function HighlightsSection() {
  const [list, setList] = useState<Highlight[]>([]); const [form, setForm] = useState<Omit<Highlight, "id">>({ title: "", date: "", youtubeId: "", videoUrl: "", description: "" });
  const [useYt, setUseYt] = useState(true); const [vf, setVf] = useState<File | null>(null); const [prog, setProg] = useState(0); const [loading, setLoading] = useState(false);
  const vRef = useRef<HTMLInputElement>(null);
  const load = () => getHighlights().then(setList);
  useEffect(() => { load(); }, []);
  const handleAdd = async (e: React.FormEvent) => { e.preventDefault(); if (list.length >= 4) { alert("Máximo 4"); return; } setLoading(true); let f = { ...form }; if (!useYt && vf) { setProg(1); const r = await uploadToCloudinary(vf, setProg); f = { ...f, videoUrl: r.url, youtubeId: "" }; } await addHighlight(f); setForm({ title: "", date: "", youtubeId: "", videoUrl: "", description: "" }); setVf(null); setProg(0); await load(); setLoading(false); };
  return <Section title={`Melhores Momentos (${list.length}/4)`} emoji="🎯">
    <div className="flex gap-3 mb-6">{["youtube", "upload"].map(m => <button key={m} type="button" onClick={() => setUseYt(m === "youtube")} className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-colors ${(m === "youtube") === useYt ? "bg-red-600 border-red-600 text-white" : "bg-transparent border-[#333] text-[#666]"}`}>{m === "youtube" ? "📺 YouTube" : "📱 Celular"}</button>)}</div>
    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-[#222]">
      <Input label="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <Input label="Data" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      {useYt ? <div className="md:col-span-2"><Input label="ID do YouTube" value={form.youtubeId || ""} onChange={e => setForm({ ...form, youtubeId: e.target.value })} placeholder="Ex: ABC123xyz" required={useYt} /></div> : <div className="md:col-span-2"><UploadArea label="Vídeo" accept="video/*" onChange={f => setVf(f?.[0] || null)} inputRef={vRef} preview={null} />{vf && <p className="text-red-400 text-xs mt-1">✓ {vf.name}</p>}<ProgressBar pct={prog} label={`Enviando... ${prog}%`} /></div>}
      <div className="md:col-span-2"><Textarea label="Descrição" value={form.description} rows={2} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div><SaveBtn loading={loading} label={list.length >= 4 ? "Limite atingido" : "Adicionar"} /></div>
    </form>
    <div className="space-y-3">{list.length === 0 && <p className="text-[#555] text-sm">Nenhum highlight.</p>}{list.map(h => <div key={h.id} className="flex items-center justify-between bg-[#0D0D0D] rounded-lg px-4 py-3 border border-[#1C1C1C]"><div><p className="text-white font-semibold text-sm">{h.title}</p><p className="text-[#555] text-xs">{h.date}</p></div><button onClick={() => { if (confirm("Remover?")) deleteHighlight(h.id!).then(load); }} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase">Remover</button></div>)}</div>
  </Section>;
}

// ─── Visão do Árbitro ──────────────────────────────────────────────────────────
function ArbitroSection() {
  const [list, setList] = useState<ArbitroVideo[]>([]); const [form, setForm] = useState<Omit<ArbitroVideo, "id">>({ title: "", date: "", videoUrl: "", description: "" });
  const [vf, setVf] = useState<File | null>(null); const [tf, setTf] = useState<File | null>(null); const [tp, setTp] = useState<string | null>(null); const [prog, setProg] = useState(0); const [loading, setLoading] = useState(false);
  const vRef = useRef<HTMLInputElement>(null); const tRef = useRef<HTMLInputElement>(null);
  const load = () => getArbitroVideos().then(setList);
  useEffect(() => { load(); }, []);
  const handleAdd = async (e: React.FormEvent) => { e.preventDefault(); if (list.length >= 2) { alert("Máximo 2"); return; } setLoading(true); let f = { ...form }; if (vf) { setProg(1); const r = await uploadToCloudinary(vf, setProg); f = { ...f, videoUrl: r.url }; } if (tf) { const comp = await comprimirImagem(tf); const r = await uploadToCloudinary(comp); f = { ...f, thumbnail: r.url }; } await addArbitroVideo(f); setForm({ title: "", date: "", videoUrl: "", description: "" }); setVf(null); setTf(null); setTp(null); setProg(0); await load(); setLoading(false); };
  return <Section title={`Visão do Árbitro (${list.length}/2)`} emoji="👁">
    <p className="text-[#555] text-sm -mt-4 mb-6">Vídeos verticais da câmera de ação no peito do árbitro.</p>
    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-[#222]">
      <Input label="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Ex: Árbitro — Jogo 15" />
      <Input label="Data" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      <div className="md:col-span-2"><UploadArea label="Vídeo Vertical (câmera de ação)" accept="video/*" onChange={f => setVf(f?.[0] || null)} inputRef={vRef} preview={null} />{vf && <p className="text-yellow-400 text-xs mt-1">✓ {vf.name}</p>}<ProgressBar pct={prog} label={`Enviando... ${prog}%`} /></div>
      <div className="md:col-span-2"><UploadArea label="Foto de Capa (opcional)" accept="image/*" onChange={f => { setTf(f?.[0] || null); if (f?.[0]) setTp(URL.createObjectURL(f[0])); }} inputRef={tRef} preview={tp} /></div>
      <div className="md:col-span-2"><Textarea label="Descrição (opcional)" value={form.description || ""} rows={2} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div><SaveBtn loading={loading} label={list.length >= 2 ? "Limite atingido" : "Adicionar Vídeo"} /></div>
    </form>
    <div className="space-y-3">{list.length === 0 && <p className="text-[#555] text-sm">Nenhum vídeo do árbitro.</p>}{list.map(v => <div key={v.id} className="flex items-center justify-between bg-[#0D0D0D] rounded-lg px-4 py-3 border border-[#1C1C1C]"><div className="flex items-center gap-3">{v.thumbnail && <img src={v.thumbnail} alt="" className="w-10 h-14 object-cover rounded" />}<div><p className="text-white font-semibold text-sm">{v.title}</p><p className="text-[#555] text-xs">{v.date}</p></div></div><button onClick={() => { if (confirm("Remover?")) deleteArbitroVideo(v.id!).then(load); }} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase">Remover</button></div>)}</div>
  </Section>;
}

// ─── Entrevistas ───────────────────────────────────────────────────────────────
function InterviewsSection() {
  const [list, setList] = useState<Interview[]>([]); const [form, setForm] = useState<Omit<Interview, "id">>({ name: "", role: "", date: "", thumbnail: "", youtubeId: "", description: "" });
  const [useYt, setUseYt] = useState(true); const [vf, setVf] = useState<File | null>(null); const [tf, setTf] = useState<File | null>(null); const [tp, setTp] = useState<string | null>(null); const [prog, setProg] = useState(0); const [loading, setLoading] = useState(false);
  const vRef = useRef<HTMLInputElement>(null); const tRef = useRef<HTMLInputElement>(null);
  const load = () => getInterviews().then(setList);
  useEffect(() => { load(); }, []);
  const handleAdd = async (e: React.FormEvent) => { e.preventDefault(); if (list.length >= 2) { alert("Máximo 2"); return; } setLoading(true); let f = { ...form }; if (!useYt && vf) { setProg(1); const r = await uploadToCloudinary(vf, setProg); f = { ...f, youtubeId: "", videoUrl: r.url } as any; } if (tf) { const comp = await comprimirImagem(tf); const r = await uploadToCloudinary(comp); f = { ...f, thumbnail: r.url }; } else if (useYt && form.youtubeId) { f = { ...f, thumbnail: `https://img.youtube.com/vi/${form.youtubeId}/hqdefault.jpg` }; } await addInterview(f); setForm({ name: "", role: "", date: "", thumbnail: "", youtubeId: "", description: "" }); setVf(null); setTf(null); setTp(null); setProg(0); await load(); setLoading(false); };
  return <Section title={`Entrevistas (${list.length}/2)`} emoji="🎙">
    <div className="flex gap-3 mb-6">{["youtube", "upload"].map(m => <button key={m} type="button" onClick={() => setUseYt(m === "youtube")} className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-colors ${(m === "youtube") === useYt ? "bg-red-600 border-red-600 text-white" : "bg-transparent border-[#333] text-[#666]"}`}>{m === "youtube" ? "📺 YouTube" : "📱 Celular"}</button>)}</div>
    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-[#222]">
      <Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <Input label="Posição" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
      <Input label="Data" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      {useYt ? <Input label="ID do YouTube" value={form.youtubeId || ""} onChange={e => setForm({ ...form, youtubeId: e.target.value })} placeholder="ABC123xyz" required={useYt} /> : <div><UploadArea label="Vídeo (vertical)" accept="video/*" onChange={f => setVf(f?.[0] || null)} inputRef={vRef} preview={null} />{vf && <p className="text-red-400 text-xs mt-1">✓ {vf.name}</p>}<ProgressBar pct={prog} /></div>}
      <div className="md:col-span-2"><UploadArea label="Foto de Capa (opcional)" accept="image/*" onChange={f => { setTf(f?.[0] || null); if (f?.[0]) setTp(URL.createObjectURL(f[0])); }} inputRef={tRef} preview={tp} /></div>
      <div className="md:col-span-2"><Textarea label="Descrição" value={form.description} rows={2} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div><SaveBtn loading={loading} label="Adicionar Entrevista" /></div>
    </form>
    <div className="space-y-3">{list.length === 0 && <p className="text-[#555] text-sm">Nenhuma entrevista.</p>}{list.map(iv => <div key={iv.id} className="flex items-center justify-between bg-[#0D0D0D] rounded-lg px-4 py-3 border border-[#1C1C1C]"><div className="flex items-center gap-3">{iv.thumbnail && <img src={iv.thumbnail} alt="" className="w-12 h-8 object-cover rounded" />}<div><p className="text-white font-semibold text-sm">{iv.name}</p><p className="text-[#555] text-xs">{iv.role} · {iv.date}</p></div></div><button onClick={() => { if (confirm("Remover?")) deleteInterview(iv.id!).then(load); }} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase">Remover</button></div>)}</div>
  </Section>;
}

// ─── Galeria ───────────────────────────────────────────────────────────────────
function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]); const [files, setFiles] = useState<FileList | null>(null); const [alt, setAlt] = useState(""); const [prog, setProg] = useState(0); const [cur, setCur] = useState(0); const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const load = () => getGallery().then(setPhotos);
  useEffect(() => { load(); }, []);
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); if (!files || !files.length) return; setLoading(true);
    for (let i = 0; i < files.length; i++) { setCur(i + 1); setProg(0); const comp = await comprimirImagem(files[i]); const r = await uploadToCloudinary(comp, setProg); await addPhoto({ src: r.url, alt: alt || `Foto ${i + 1}`, date: new Date().toISOString().split("T")[0] }); }
    setAlt(""); setFiles(null); setProg(0); setCur(0); if (ref.current) ref.current.value = ""; await load(); setLoading(false);
  };
  return <Section title={`Galeria (${photos.length} fotos)`} emoji="📷">
    <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 mb-6 pb-6 border-b border-[#222]">
      <UploadArea label="Fotos (pode selecionar várias)" accept="image/*" multiple onChange={f => setFiles(f)} inputRef={ref} preview={null} />
      {files && files.length > 0 && <p className="text-red-400 text-sm">✓ {files.length} foto{files.length > 1 ? "s" : ""} — comprimidas antes do envio</p>}
      {loading && <ProgressBar pct={prog} label={`Enviando foto ${cur} de ${files?.length}... ${prog}%`} />}
      <Input label="Legenda (opcional)" value={alt} onChange={e => setAlt(e.target.value)} placeholder="Ex: Jogo contra o Pelotão" />
      <div><SaveBtn loading={loading} label={loading ? `Enviando ${cur}/${files?.length}...` : "Enviar Fotos"} /></div>
    </form>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {photos.map(p => <div key={p.id} className="relative group aspect-square rounded-lg overflow-hidden bg-[#0D0D0D]"><img src={p.src} alt={p.alt} className="w-full h-full object-cover" /><button onClick={() => { if (confirm("Remover?")) deletePhoto(p.id!).then(load); }} className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs font-bold">Remover</button></div>)}
      {!photos.length && <p className="text-[#555] text-sm col-span-full">Nenhuma foto.</p>}
    </div>
  </Section>;
}

// ─── Próximo Jogo ──────────────────────────────────────────────────────────────
function NextMatchSection() {
  const [data, setData] = useState<NextMatch>({ date: "", time: "", location: "" }); const [loading, setLoading] = useState(false); const [saved, setSaved] = useState(false);
  useEffect(() => { getNextMatch().then(m => { if (m) setData(m); }); }, []);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); await saveNextMatch(data); setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return <Section title="Próximo Jogo" emoji="📅"><form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Data" type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} required />
    <Input label="Horário" type="time" value={data.time} onChange={e => setData({ ...data, time: e.target.value })} required />
    <div className="md:col-span-2"><Input label="Local" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} required /></div>
    <div className="flex items-center gap-4"><SaveBtn loading={loading} />{saved && <span className="text-green-500 text-sm">✓ Salvo!</span>}</div>
  </form></Section>;
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false); const [checked, setChecked] = useState(false);
  useEffect(() => { if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true); setChecked(true); }, []);
  if (!checked) return null;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <div className="min-h-screen bg-[#0D0D0D] px-4 py-8">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-white font-black text-4xl uppercase" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>⚽ Painel Admin</h1><p className="text-[#555] text-sm">Resenha do Combinado</p></div>
        <div className="flex items-center gap-4"><a href="/" className="text-[#555] hover:text-white text-sm">← Ver Site</a><button onClick={() => { sessionStorage.removeItem("admin_auth"); setAuthed(false); }} className="text-[#555] hover:text-red-400 text-sm">Sair</button></div>
      </div>
      <ConfigSection />
      <ResenhaSection />
      <HighlightsSection />
      <ArbitroSection />
      <InterviewsSection />
      <GallerySection />
      <NextMatchSection />
    </div>
  </div>;
}
