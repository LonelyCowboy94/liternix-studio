export const getPublicIdFromUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;

  try {
    const parts = url.split("/");
    
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/");

    const publicId = publicIdWithExtension.split(".")[0];

    return publicId;
  } catch (error) {
    console.error("Greška pri izvlačenju public_id-a:", error);
    return null;
  }
};