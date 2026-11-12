import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Interview, Highlight, ArbitroVideo, LatestResenha, GalleryPhoto, NextMatch, SiteConfig, GrupoInfo } from "@/types";

// Grupo padrão: usa os dados que já existem na raiz do Firebase (nada é migrado ou perdido).
// Os demais grupos ficam em grupos/{slug}/...
export const GRUPO_PADRAO = process.env.NEXT_PUBLIC_GRUPO_PADRAO || "lendas";
const ehPadrao = (slug?: string) => !slug || slug === GRUPO_PADRAO;
const col = (nome: string, slug?: string) => ehPadrao(slug) ? collection(db, nome) : collection(db, "grupos", slug!, nome);
const ref = (colecao: string, id: string, slug?: string) => ehPadrao(slug) ? doc(db, colecao, id) : doc(db, "grupos", slug!, colecao, id);

const RESERVADOS = ["admin", "api", "_next", "favicon.ico", "sitemap.xml", "robots.txt"];
export function slugValido(s: string) { return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length >= 2 && s.length <= 30 && !RESERVADOS.includes(s); }
export function slugify(t: string) { return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30); }

// ─── Grupos ───
export async function getSiteConfig(slug?: string): Promise<SiteConfig> { const vazio = { instagram: ehPadrao(slug) ? "resenhadocombinado" : "" }; try { const snap = await getDoc(ref("config", "site", slug)); if (!snap.exists()) return vazio; return snap.data() as SiteConfig; } catch { return vazio; } }
export async function saveSiteConfig(data: SiteConfig, slug?: string) { await setDoc(ref("config", "site", slug), { ...data, updatedAt: serverTimestamp() }); }
export async function getGrupo(slug: string): Promise<GrupoInfo | null> {
  if (ehPadrao(slug)) { const c = await getSiteConfig(); return { slug: GRUPO_PADRAO, nome: c.nomeGrupo || GRUPO_PADRAO }; }
  try { const snap = await getDoc(doc(db, "grupos", slug)); if (!snap.exists()) return null; return { slug, nome: (snap.data().nome as string) || slug }; } catch { return null; }
}
export async function listGrupos(): Promise<GrupoInfo[]> {
  const padrao = (await getGrupo(GRUPO_PADRAO)) as GrupoInfo;
  try { const snap = await getDocs(collection(db, "grupos")); const outros = snap.docs.filter(d => d.id !== GRUPO_PADRAO).map(d => ({ slug: d.id, nome: (d.data().nome as string) || d.id })).sort((a, b) => a.nome.localeCompare(b.nome)); return [padrao, ...outros]; } catch { return [padrao]; }
}
export async function criarGrupo(slug: string, nome: string) {
  await setDoc(doc(db, "grupos", slug), { nome, criadoEm: serverTimestamp() });
  await setDoc(doc(db, "grupos", slug, "config", "site"), { instagram: "", nomeGrupo: nome, updatedAt: serverTimestamp() });
}

const SUBCOLECOES = ["resenhas", "interviews", "highlights", "arbitro", "gallery", "config"];
export async function deleteGrupo(slug: string) {
  if (ehPadrao(slug)) throw new Error("O grupo padrão não pode ser excluído.");
  for (const nome of SUBCOLECOES) {
    const snap = await getDocs(collection(db, "grupos", slug, nome));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  }
  await deleteDoc(doc(db, "grupos", slug));
}

// ─── Conteúdo (todas as funções aceitam o grupo no final) ───
export async function getLatestResenha(slug?: string): Promise<LatestResenha | null> { try { const q = query(col("resenhas", slug), orderBy("date", "desc"), limit(1)); const snap = await getDocs(q); if (snap.empty) return null; const d = snap.docs[0]; return { id: d.id, ...d.data() } as LatestResenha; } catch { return null; } }
export async function saveResenha(data: Omit<LatestResenha, "id">, id?: string, slug?: string) { if (id) { await updateDoc(ref("resenhas", id, slug), { ...data, updatedAt: serverTimestamp() }); } else { await addDoc(col("resenhas", slug), { ...data, createdAt: serverTimestamp() }); } }
export async function deleteResenha(id: string, slug?: string) { await deleteDoc(ref("resenhas", id, slug)); }
export async function getInterviews(slug?: string): Promise<Interview[]> { try { const q = query(col("interviews", slug), orderBy("date", "desc"), limit(2)); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as Interview)); } catch { return []; } }
export async function addInterview(data: Omit<Interview, "id">, slug?: string) { await addDoc(col("interviews", slug), { ...data, createdAt: serverTimestamp() }); }
export async function deleteInterview(id: string, slug?: string) { await deleteDoc(ref("interviews", id, slug)); }
export async function getHighlights(slug?: string): Promise<Highlight[]> { try { const q = query(col("highlights", slug), orderBy("date", "desc"), limit(6)); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as Highlight)); } catch { return []; } }
export async function addHighlight(data: Omit<Highlight, "id">, slug?: string) { await addDoc(col("highlights", slug), { ...data, createdAt: serverTimestamp() }); }
export async function deleteHighlight(id: string, slug?: string) { await deleteDoc(ref("highlights", id, slug)); }
export async function getArbitroVideos(slug?: string): Promise<ArbitroVideo[]> { try { const q = query(col("arbitro", slug), orderBy("date", "desc"), limit(2)); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as ArbitroVideo)); } catch { return []; } }
export async function addArbitroVideo(data: Omit<ArbitroVideo, "id">, slug?: string) { await addDoc(col("arbitro", slug), { ...data, createdAt: serverTimestamp() }); }
export async function deleteArbitroVideo(id: string, slug?: string) { await deleteDoc(ref("arbitro", id, slug)); }
export async function getGallery(slug?: string): Promise<GalleryPhoto[]> { try { const q = query(col("gallery", slug), orderBy("createdAt", "desc")); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryPhoto)); } catch { return []; } }
export async function addPhoto(data: Omit<GalleryPhoto, "id">, slug?: string) { await addDoc(col("gallery", slug), { ...data, createdAt: serverTimestamp() }); }
export async function deletePhoto(id: string, slug?: string) { await deleteDoc(ref("gallery", id, slug)); }
export async function getNextMatch(slug?: string): Promise<NextMatch | null> { try { const snap = await getDoc(ref("config", "nextMatch", slug)); if (!snap.exists()) return null; return snap.data() as NextMatch; } catch { return null; } }
export async function saveNextMatch(data: NextMatch, slug?: string) { await setDoc(ref("config", "nextMatch", slug), { ...data, updatedAt: serverTimestamp() }); }
