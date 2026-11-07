import type { Metadata } from "next";
import HeroSection from "@/app/components/HeroSection";
import LatestResenha from "@/app/components/LatestResenha";
import Highlights from "@/app/components/Highlights";
import ArbitroVideos from "@/app/components/ArbitroVideos";
import InterviewsGrid from "@/app/components/InterviewsGrid";
import GameGallery from "@/app/components/GameGallery";
import NextMatch from "@/app/components/NextMatch";
import AboutProject from "@/app/components/AboutProject";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Comunicado from "@/app/components/Comunicado";
import ThemeProvider from "@/app/components/ThemeProvider";
import { getLatestResenha, getInterviews, getHighlights, getArbitroVideos, getGallery, getNextMatch, getSiteConfig, GRUPO_PADRAO } from "@/lib/firestore";
import matchSponsorsFallback from "@/data/match-sponsors.json";
import type { LatestResenha as LRT } from "@/types";

export async function metadataGrupo(slug?: string): Promise<Metadata> {
  const c = await getSiteConfig(slug);
  const nome = c.nomeGrupo || "Combinado";
  return {
    title: `Resenha do ${nome} | Futebol Amador`,
    description: "As histórias, entrevistas e melhores momentos depois do apito final.",
    ...(c.logoUrl ? { openGraph: { title: `Resenha do ${nome}`, images: [c.logoUrl] } } : {}),
  };
}

export default async function GrupoPage({ slug }: { slug?: string }) {
  const padrao = !slug || slug === GRUPO_PADRAO;
  const [resenha, interviews, highlights, arbitroVideos, gallery, nextMatch, siteConfig] = await Promise.all([
    getLatestResenha(slug), getInterviews(slug), getHighlights(slug), getArbitroVideos(slug), getGallery(slug), getNextMatch(slug), getSiteConfig(slug),
  ]);

  const resenhaData = resenha?.title ? (resenha as LRT) : null;
  const nextMatchData = nextMatch ?? (padrao ? matchSponsorsFallback.nextMatch : null);
  const instagram = siteConfig.instagram || (padrao ? "resenhadocombinado" : "");
  const nomeGrupo = siteConfig.nomeGrupo || "Combinado";
  const comunicado = siteConfig.comunicadoAtivo ? siteConfig.comunicado || "" : "";

  return (
    <ThemeProvider primaryColor={siteConfig.primaryColor}>
      <Navbar instagram={instagram} logoUrl={siteConfig.logoUrl} nomeGrupo={nomeGrupo} />
      {comunicado && <Comunicado texto={comunicado} />}
      <main>
        <HeroSection logoUrl={siteConfig.logoUrl} nomeGrupo={nomeGrupo} />
        {resenhaData && <LatestResenha data={resenhaData} />}
        {highlights.length > 0 && <Highlights highlights={highlights} />}
        {arbitroVideos.length > 0 && <ArbitroVideos videos={arbitroVideos} />}
        {interviews.length > 0 && <InterviewsGrid interviews={interviews} />}
        {gallery.length > 0 && <GameGallery photos={gallery} />}
        {nextMatchData && <NextMatch match={nextMatchData} />}
        <AboutProject nomeGrupo={nomeGrupo} />
        <Footer instagram={instagram} nomeGrupo={nomeGrupo} />
      </main>
    </ThemeProvider>
  );
}
