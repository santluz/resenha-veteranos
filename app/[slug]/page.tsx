import { notFound } from "next/navigation";
import GrupoPage, { metadataGrupo } from "@/app/components/GrupoPage";
import { getGrupo } from "@/lib/firestore";
export const revalidate = 60;
export async function generateStaticParams() { return []; }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const { slug } = await params; return metadataGrupo(slug.toLowerCase()); }
export default async function GrupoRoute({ params }: Props) {
  const slug = (await params).slug.toLowerCase();
  const grupo = await getGrupo(slug);
  if (!grupo) notFound();
  return <GrupoPage slug={slug} />;
}
