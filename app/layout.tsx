import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Resenha do Combinado | Futebol Amador", description: "As histórias, entrevistas e melhores momentos depois do apito final." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0D0D0D] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  );
}
