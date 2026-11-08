"use client";
import { useEffect } from "react";
import { gerarPaleta } from "@/lib/extractColor";
interface Props { primaryColor?: string; children: React.ReactNode; }
export default function ThemeProvider({ primaryColor, children }: Props) {
  useEffect(() => {
    const paleta = gerarPaleta(primaryColor || "#dc2626");
    const root = document.documentElement;
    root.style.setProperty("--color-primary", paleta.primary);
    root.style.setProperty("--color-primary-dark", paleta.dark);
    root.style.setProperty("--color-primary-bg", paleta.bg);
  }, [primaryColor]);
  return <>{children}</>;
}
