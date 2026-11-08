export interface ExtractedColor { hex: string; r: number; g: number; b: number; }
export async function extractDominantColor(imageUrl: string): Promise<ExtractedColor> {
  return new Promise(resolve => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas"); const size = 50;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d")!; ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const colorMap: Record<string, { count: number; r: number; g: number; b: number }> = {};
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]];
        if (a < 128) continue;
        const brilho = (r + g + b) / 3;
        if (brilho < 30 || brilho > 220) continue;
        if ((Math.max(r,g,b) - Math.min(r,g,b)) / Math.max(r,g,b) < 0.25) continue;
        const [rg, gg, bg] = [Math.round(r/20)*20, Math.round(g/20)*20, Math.round(b/20)*20];
        const key = `${rg},${gg},${bg}`;
        if (!colorMap[key]) colorMap[key] = { count: 0, r: rg, g: gg, b: bg };
        colorMap[key].count++;
      }
      const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count);
      if (!sorted.length) { resolve({ hex: "#dc2626", r: 220, g: 38, b: 38 }); return; }
      const { r, g, b } = sorted[0];
      resolve({ hex: `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`, r, g, b });
    };
    img.onerror = () => resolve({ hex: "#dc2626", r: 220, g: 38, b: 38 });
    img.src = imageUrl;
  });
}
export function gerarPaleta(hex: string) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const esc = (v: number, f: number) => Math.max(0, Math.round(v*f));
  const clr = (v: number, f: number) => Math.min(255, Math.round(v+(255-v)*f));
  const toHex = (r: number, g: number, b: number) => `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  return { primary: hex, dark: toHex(esc(r,.7),esc(g,.7),esc(b,.7)), darker: toHex(esc(r,.5),esc(g,.5),esc(b,.5)), light: toHex(clr(r,.3),clr(g,.3),clr(b,.3)), bg: toHex(esc(r,.15),esc(g,.15),esc(b,.15)) };
}
