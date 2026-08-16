const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "resenha_unsigned";
export type UploadResult = { url: string; publicId: string; resourceType: "image" | "video"; };
export function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const resourceType = file.type.startsWith("video") ? "video" : "image";
    const formData = new FormData();
    formData.append("file", file); formData.append("upload_preset", UPLOAD_PRESET); formData.append("folder", "resenha-do-combinado");
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", e => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); });
    xhr.addEventListener("load", () => { if (xhr.status === 200) { const d = JSON.parse(xhr.responseText); resolve({ url: d.secure_url, publicId: d.public_id, resourceType }); } else reject(new Error("Upload falhou")); });
    xhr.addEventListener("error", () => reject(new Error("Erro de rede")));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    xhr.send(formData);
  });
}
