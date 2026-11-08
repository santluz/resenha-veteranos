"use client";
import { useState } from "react";
interface Props { texto: string; }
export default function Comunicado({ texto }: Props) {
  const [v, setV] = useState(true);
  if (!v || !texto) return null;
  return <div className="bg-red-600 text-white px-4 py-3 relative z-50"><div className="max-w-6xl mx-auto flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span>📢</span><p className="text-sm font-semibold">{texto}</p></div><button onClick={() => setV(false)} className="text-white/70 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div></div>;
}
