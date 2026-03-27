import AsyncStorage from "@react-native-async-storage/async-storage";
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

const MEDIA_CACHE_KEY = "cached_media_items";

const mapMediaItem = (item: any): MediaItem => ({
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
});

const mergeCachedMedia = (existing: MediaItem[], incoming: MediaItem[]) => {
  const merged = [...existing];

  incoming.forEach((item) => {
    const index = merged.findIndex((cached) => cached.id === item.id);

    if (index >= 0) {
      merged[index] = item;
      return;
    }

    merged.push(item);
  });

  return merged;
};

const saveCachedMedia = async (page: number, items: MediaItem[]) => {
  try {
    const existing = page === 1 ? [] : await getCachedMedia();
    const merged = page === 1 ? items : mergeCachedMedia(existing, items);
    await AsyncStorage.setItem(MEDIA_CACHE_KEY, JSON.stringify(merged));
  } catch (error: any) {
    console.log("Media cache save error:", error?.message || error);
  }
};

const getCachedMedia = async (): Promise<MediaItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(MEDIA_CACHE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    console.log("Media cache read error:", error?.message || error);
    return [];
  }
};

const updateCachedFavoriteState = async (id: string, isFavorite: boolean) => {
  try {
    const existing = await getCachedMedia();
    const updated = existing.map((item) =>
      item.id === id ? { ...item, isFavorite } : item
    );
    await AsyncStorage.setItem(MEDIA_CACHE_KEY, JSON.stringify(updated));
  } catch (error: any) {
    console.log("Media cache favorite update error:", error?.message || error);
  }
};

const PAGE_SIZE = 8;

const getRawItems = (response: any): any[] => {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response?.items) ? response.items : [];
};

const getTotalCount = (response: any, rawCount: number): number => {
  if (typeof response?.total === "number") {
    return response.total;
  }

  if (typeof response?.count === "number") {
    return response.count;
  }

  return rawCount;
};

const getHasMore = (response: any, page: number, total: number, rawCount: number): boolean => {
  if (typeof response?.hasMore === "boolean") {
    return response.hasMore;
  }

  if (typeof response?.has_next === "boolean") {
    return response.has_next;
  }

  if (typeof response?.nextPage === "number") {
    return response.nextPage > page;
  }

  if (typeof response?.total === "number" || typeof response?.count === "number") {
    return page * PAGE_SIZE < total;
  }

  return rawCount === PAGE_SIZE;
};

const getCachedPage = (items: MediaItem[], page: number) => {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return items.slice(start, end);
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
  mediaType?: 'image' | 'video'
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
    const response = await getImagesApi(page, PAGE_SIZE);
    const raw = getRawItems(response);
    const total = getTotalCount(response, raw.length);
    const hasMore = getHasMore(response, page, total, raw.length);
    const data: MediaItem[] = raw.map(mapMediaItem);

    await saveCachedMedia(page, data);

    console.log("[mediaService] getMedia", {
      page,
      pageSize: PAGE_SIZE,
      rawCount: raw.length,
      total,
      hasMore,
      responseType: Array.isArray(response) ? "array" : "object",
    });

    return { data, hasMore, total };
  } catch (error: any) {
    console.log("Fetch error:", error?.response?.data || error.message);
    const cachedItems = await getCachedMedia();
    const cachedPage = getCachedPage(cachedItems, page);
    const cachedHasMore = page * PAGE_SIZE < cachedItems.length;

    if (cachedPage.length > 0) {
      console.log("Using cached media because the latest fetch failed.");
      return { data: cachedPage, hasMore: cachedHasMore, total: cachedItems.length };
    }

    throw error;
  }
};

// ── Toggle favorite ───────────────────────
export const toggleFavorite = async (media: MediaItem): Promise<MediaItem> => {
  try {
    const newFavoriteState = !media.isFavorite;
    await toggleFavoriteApi(media.id, newFavoriteState);
    await updateCachedFavoriteState(media.id, newFavoriteState);

    return {
      ...media,
      isFavorite: newFavoriteState,
    };
  } catch (error: any) {
    console.log("Toggle favorite error:", error?.response?.data || error.message);
    throw error;
  }
};
