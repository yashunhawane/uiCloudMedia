import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MediaCard from "../../src/components/MediaCard";
import MediaViewer from "../../src/components/MediaViewer";
import SkeletonCard, { CARD_WIDTH } from "../../src/components/SkeletonCard";
import { getMedia, MediaItem, toggleFavorite } from "../../src/services/mediaService";

import { colors, spacing, ui } from "../../src/Theam";



// ─── List Footer ──────────────────────────────────────────────────────────────
const ListFooter = ({ loading }: { loading: boolean }) =>
  loading ? (
    <View style={ui.listFooter}>
      <ActivityIndicator color={colors.primary} size="small" />
      <Text style={ui.listFooterText}>Loading more…</Text>
    </View>
  ) : null;

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const fabAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => { loadMore(true); }, [loadMore]);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(fabAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [fabAnim]);

  const loadMore = useCallback(async (reset = false) => {
    if (loading) return;
    if (!reset && !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = reset ? 1 : page + 1;
      const result = await getMedia(nextPage);
      setItems((prev) => (reset ? result.data : [...prev, ...result.data]));
      setTotal(result.total);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch {
      setError("Failed to load media.");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading, hasMore, page]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadMore(true);
    setRefreshing(false);
  }, [loadMore]);

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) loadMore();
  }, [loading, hasMore, loadMore]);

  const openViewer = useCallback((item: MediaItem) => {
    setSelectedItem(item);
  }, []);

  const closeViewer = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const toggleLike = useCallback(async (item: MediaItem) => {
    try {
      const updatedItem = await toggleFavorite(item.id);
      
      // Optimistic update first
      setLikedIds((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      );
      
      // Update items list
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? updatedItem : i))
      );
      
      console.log(`Toggled favorite for ${item.id} to ${updatedItem.isFavorite}`);
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error?.response?.data || error.message);
      // Revert optimistic update if needed, but for simplicity skip
    }
  }, []);

  const rows: [MediaItem | null, MediaItem | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i] ?? null, items[i + 1] ?? null]);
  }

  const renderRow = ({ item: row }: { item: [MediaItem | null, MediaItem | null] }) => (
    <View style={ui.gridRow}>
      {row[0] && <MediaCard item={row[0]} onPress={openViewer} />}
      {row[1] ? (
        <MediaCard item={row[1]} onPress={openViewer} />
      ) : (
        <View style={{ width: CARD_WIDTH }} />
      )}
    </View>
  );

  const skeletonHeights = [180, 220, 160, 240, 190, 210];

  return (
    <View style={ui.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={ui.blobTopRight} pointerEvents="none" />

      {/* Header */}
      <View style={ui.homeHeader}>
        <View>
          <Text style={ui.homeHeaderTitle}>Your Gallery</Text>
          <Text style={ui.homeHeaderSub}>
            {initialLoad ? "Loading…" : total > 0 ? `${total} memories` : "No media yet"}
          </Text>
        </View>
        <TouchableOpacity style={ui.avatarBtn} activeOpacity={0.8}>
          <Text style={ui.avatarText}>U</Text>
        </TouchableOpacity>
      </View>

      {/* Feed or Skeleton */}
      {initialLoad ? (
        <View style={ui.gridContent}>
          {Array.from({ length: 3 }).map((_, ri) => (
            <View key={ri} style={ui.gridRow}>
              <SkeletonCard height={skeletonHeights[ri * 2] ?? 200} />
              <SkeletonCard height={skeletonHeights[ri * 2 + 1] ?? 180} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(_, i) => `row-${i}`}
          renderItem={renderRow}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={<ListFooter loading={loading && !initialLoad} />}
          contentContainerStyle={ui.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={ui.centered}>
              {error ? (
                <>
                  <Text style={{ fontSize: 40 }}>⚠️</Text>
                  <Text style={[ui.subheading, { marginTop: spacing.md, textAlign: "center" }]}>
                    {error}
                  </Text>
                  <TouchableOpacity
                    onPress={() => loadMore(true)}
                    style={[ui.buttonSecondary, { marginTop: spacing.lg, paddingHorizontal: spacing.xl }]}
                  >
                    <Text style={ui.buttonSecondaryText}>Retry</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 48 }}>🖼️</Text>
                  <Text style={[ui.subheading, { marginTop: spacing.md, textAlign: "center" }]}>
                    No media yet.{"\n"}Upload something!
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}

      {/* FAB */}
      <Animated.View style={[ui.fab, { transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity
          style={ui.fabBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/imageUpload/upload")}
        >
          <Text style={ui.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      <MediaViewer
        item={selectedItem}
        visible={!!selectedItem}
        liked={selectedItem ? likedIds.includes(selectedItem.id) : false}
        onClose={closeViewer}
        onToggleLike={toggleLike}
      />
    </View>
  );
}
