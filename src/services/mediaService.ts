import { getFavoritesApi, getImagesApi, toggleFavoriteApi, uploadMediaApi } from "../api/mediaApi";

export type MediaItem = {
  id: string;
  type: "image" | "video";
  uri: string;
  width?: number;
  height?: number;
  timestamp: string;
  isFavorite?: boolean;
};

export const uploadMedia = async (file: any) => {
  try {
    const res = await uploadMediaApi(file);
    return res;
  } catch (error: any) {
    console.log("Upload error:", error?.response?.data || error.message);
    throw error;
  }
};

// ── Get paginated favorites ───────────────────────
export const getFavorites = async (
  page: number,
  mediaType: 'image' | 'video' = 'image'
): Promise<{ data: MediaItem[]; hasMore: boolean; total: number }> => {
  try {
    const PAGE_SIZE = 20;
    const raw: any[] = await getFavoritesApi(page, PAGE_SIZE, mediaType);
    
    const data: MediaItem[] = raw.map((item) => ({
      id: item._id,
      type: item.media_type === "video" ? "video" : "image",
      uri: item.file_url,
      width: item.width,
      height: item.height,
      timestamp: new Date(item.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      isFavorite: item.is_favorite,
    }));
    
    return { data, hasMore: false, total: data.length };
  } catch (error: any) {
    console.log("Favorites fetch error:", error?.response?.data || error.message);
    throw error;
  }
};

// ── Get paginated media ───────────────────────
export const getMedia = async (
  page: number
): Promise<{ data: MediaItem[]; hasMore: boolean; total: number }> => {
  try {
    const PAGE_SIZE = 20;
    const raw: any[] = await getImagesApi(page, PAGE_SIZE); // response is a plain array
 
    const data: MediaItem[] = raw.map((item) => ({
      id: item._id,
      type: item.media_type === "video" ? "video" : "image",
      uri: item.file_url,
      width: item.width,
      height: item.height,
      timestamp: new Date(item.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      isFavorite: item.is_favorite,
    }));
 
    // API returns all items (no server-side pagination yet), so hasMore is false
    return { data, hasMore: false, total: data.length };
  } catch (error: any) {
    console.log("Fetch error:", error?.response?.data || error.message);
    throw error;
  }
};

// ── Toggle favorite ───────────────────────
export const toggleFavorite = async (id: string): Promise<MediaItem> => {
  try {
    const media = await getMedia(1).then(r => r.data.find(item => item.id === id));
    if (!media) throw new Error("Media not found");

    const newFavoriteState = !media.isFavorite;
    await toggleFavoriteApi(id, newFavoriteState);
    
    return {
      ...media,
      isFavorite: newFavoriteState
    };
  } catch (error: any) {
    console.log("Toggle favorite error:", error?.response?.data || error.message);
    throw error;
  }
};

