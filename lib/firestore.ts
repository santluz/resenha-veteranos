import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Interview, Highlight, ArbitroVideo, LatestResenha, GalleryPhoto, NextMatch, SiteConfig } from "@/types";
export async function getSiteConfig(): Promise<SiteConfig> { try { const snap = await getDoc(doc(db,"config","site")); if (!snap.exists()) return { instagram: "resenhadocombinado" }; return snap.data() as SiteConfig; } catch { return { instagram: "resenhadocombinado" }; } }
export async function saveSiteConfig(data: SiteConfig) { await setDoc(doc(db,"config","site"), { ...data, updatedAt: serverTimestamp() }); }
export async function getLatestResenha(): Promise<LatestResenha | null> { try { const q = query(collection(db,"resenhas"),orderBy("date","desc"),limit(1)); const snap = await getDocs(q); if (snap.empty) return null; const d = snap.docs[0]; return { id: d.id, ...d.data() } as LatestResenha; } catch { return null; } }
export async function saveResenha(data: Omit<LatestResenha,"id">, id?: string) { if (id) { await updateDoc(doc(db,"resenhas",id),{...data,updatedAt:serverTimestamp()}); } else { await addDoc(collection(db,"resenhas"),{...data,createdAt:serverTimestamp()}); } }
export async function deleteResenha(id: string) { await deleteDoc(doc(db,"resenhas",id)); }
export async function getInterviews(): Promise<Interview[]> { try { const q = query(collection(db,"interviews"),orderBy("date","desc"),limit(2)); const snap = await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()} as Interview)); } catch { return []; } }
export async function addInterview(data: Omit<Interview,"id">) { await addDoc(collection(db,"interviews"),{...data,createdAt:serverTimestamp()}); }
export async function deleteInterview(id: string) { await deleteDoc(doc(db,"interviews",id)); }
export async function getHighlights(): Promise<Highlight[]> { try { const q = query(collection(db,"highlights"),orderBy("date","desc"),limit(4)); const snap = await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()} as Highlight)); } catch { return []; } }
export async function addHighlight(data: Omit<Highlight,"id">) { await addDoc(collection(db,"highlights"),{...data,createdAt:serverTimestamp()}); }
export async function deleteHighlight(id: string) { await deleteDoc(doc(db,"highlights",id)); }
export async function getArbitroVideos(): Promise<ArbitroVideo[]> { try { const q = query(collection(db,"arbitro"),orderBy("date","desc"),limit(2)); const snap = await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()} as ArbitroVideo)); } catch { return []; } }
export async function addArbitroVideo(data: Omit<ArbitroVideo,"id">) { await addDoc(collection(db,"arbitro"),{...data,createdAt:serverTimestamp()}); }
export async function deleteArbitroVideo(id: string) { await deleteDoc(doc(db,"arbitro",id)); }
export async function getGallery(): Promise<GalleryPhoto[]> { try { const q = query(collection(db,"gallery"),orderBy("createdAt","desc")); const snap = await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()} as GalleryPhoto)); } catch { return []; } }
export async function addPhoto(data: Omit<GalleryPhoto,"id">) { await addDoc(collection(db,"gallery"),{...data,createdAt:serverTimestamp()}); }
export async function deletePhoto(id: string) { await deleteDoc(doc(db,"gallery",id)); }
export async function getNextMatch(): Promise<NextMatch | null> { try { const snap = await getDoc(doc(db,"config","nextMatch")); if (!snap.exists()) return null; return snap.data() as NextMatch; } catch { return null; } }
export async function saveNextMatch(data: NextMatch) { await setDoc(doc(db,"config","nextMatch"),{...data,updatedAt:serverTimestamp()}); }
