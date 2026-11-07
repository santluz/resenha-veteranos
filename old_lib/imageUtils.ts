export function comprimirImagem(file: File, maxWidth = 1200, qualidade = 0.8): Promise<File> {
  return new Promise(resolve => {
    if (!file.type.startsWith("image/") || file.size < 500 * 1024) { resolve(file); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => { if (blob) resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg", lastModified: Date.now() })); else resolve(file); }, "image/jpeg", qualidade);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
