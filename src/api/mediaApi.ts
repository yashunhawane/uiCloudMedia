import { getToken } from "../utils/storage";
import API from "./client";

const getAuthHeaders = async (contentType?: string) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  return {
    ...(contentType ? { "Content-Type": contentType } : {}),
    Authorization: `Bearer ${token}`,
  };
};

export const uploadMediaApi = async (file: any) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.fileName || `upload.${file.uri.split(".").pop()}`,
    type: file.mimeType || "image/jpeg",
  } as any);
  const res = await API.post("/media/upload", formData, {
    headers: await getAuthHeaders("multipart/form-data"),
  });
  return res.data;
};

// ── Get paginated favorites ───────────────────────
export const getFavoritesApi = async (page: number, limit: number, mediaType?: 'image' | 'video') => {
  const params: any = { page, limit };
  if (mediaType) {
    params.media_type = mediaType;
  }
  const res = await API.get('/media/favorites', {
    params,
    headers: await getAuthHeaders(),
  });
  console.log('Favorites API response:', res.data.items);
  return res.data.items;
};

// ── Get paginated media ───────────────────────
export const getImagesApi = async (page: number, limit = 20) => {
  const res = await API.get("/media/getimages", {
    params: { page, limit },
    headers: await getAuthHeaders(),
  });
  console.log("API response:", res.data);
  return res.data;
};

// ── Toggle favorite ───────────────────────
export const toggleFavoriteApi = async (mediaId: string, isFavorite: boolean) => {
  const res = await API.put(`/media/${mediaId}/favorite`, 
    { is_favorite: isFavorite },
    {
      headers: await getAuthHeaders("application/json"),
    }
  );
  return res.data;
};

