import { getToken } from "../utils/storage";
import API from "./client";

export const uploadMediaApi = async (file: any) => {
  const token = await getToken();
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.fileName || `upload.${file.uri.split(".").pop()}`,
    type: file.mimeType || "image/jpeg",
  } as any);
  const res = await API.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ── Get paginated favorites ───────────────────────
export const getFavoritesApi = async (page: number, limit: number, mediaType?: 'image' | 'video') => {
  const token = await getToken();
  const params: any = { page, limit };
  if (mediaType) {
    params.media_type = mediaType;
  }
  const res = await API.get('/media/favorites', {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Favorites API response:', res.data.items);
  return res.data.items;
};

// ── Get paginated media ───────────────────────
export const getImagesApi = async (page: number, limit = 20) => {
  const token = await getToken();
  const res = await API.get("/media/getimages", {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("API response:", res.data.items);
  return res.data.items;
};

// ── Toggle favorite ───────────────────────
export const toggleFavoriteApi = async (mediaId: string, isFavorite: boolean) => {
  const token = await getToken();
  const res = await API.put(`/media/${mediaId}/favorite`, 
    { is_favorite: isFavorite },
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  return res.data;
};

