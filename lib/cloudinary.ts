const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "resenha2_unsigned";
const PASTA_BASE = process.env.NEXT_PUBLIC_CLOUDINARY_PASTA || "resenha-veteranos";
export type UploadResult = { url: string; publicId: string; resourceType: "image" | "video"; };
// grupo: cada grupo salva em uma subpasta própria no Cloudinary (PASTA_BASE/grupo)
export function uploadToCloudinary(file: File, onProgress?: (pct: number) => void, grupo?: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const resourceType = file.type.startsWith("video") ? "video" : "image";
    const formData = new FormData();
    formData.append("file", file); formData.append("upload_preset", UPLOAD_PRESET); formData.append("folder", grupo ? `${PASTA_BASE}/${grupo}` : PASTA_BASE);
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", e => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); });
    xhr.addEventListener("load", () => { if (xhr.status === 200) { const d = JSON.parse(xhr.responseText); resolve({ url: d.secure_url, publicId: d.public_id, resourceType }); } else reject(new Error("Upload falhou")); });
    xhr.addEventListener("error", () => reject(new Error("Erro de rede")));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    xhr.send(formData);
  });
}
