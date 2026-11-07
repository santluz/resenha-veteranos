import GrupoPage, { metadataGrupo } from "@/app/components/GrupoPage";
export const revalidate = 60;
export async function generateMetadata() { return metadataGrupo(); }
export default function Home() { return <GrupoPage />; }
