import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MediaCard from '../../src/components/MediaCard';
import { getFavorites, MediaItem } from '../../src/services/mediaService';
import { colors, radius, shadows, spacing, typography, ui } from '../../src/Theam';


export default function FavoritesScreen() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async (isRefresh = false, isLoadMore = false) => {
    try {
      if (!isRefresh && !isLoadMore) setLoading(true);
      if (isRefresh) setRefreshing(true);
      if (isLoadMore) setLoadingMore(true);
      if (isRefresh || isLoadMore) setError(null);

      const targetPage = isLoadMore ? page : 1;
      const { data, hasMore: more } = await getFavorites(targetPage);

      setHasMore(more);
      setMedia((current) => {
        if (isRefresh || !isLoadMore) return data;
        return [...current, ...data];
      });
      setPage(isLoadMore ? targetPage + 1 : 2);
    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
      console.error('Load favorites error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const onRefresh = () => loadFavorites(true);
  const onEndReached = () => {
    if (!loadingMore && hasMore && !refreshing) {
      loadFavorites(false, true);
    }
  };

  const renderItem = ({ item }: { item: MediaItem }) => (
    <MediaCard item={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        style={styles.footerLoader}
        color={colors.primary}
        size="small"
      />
    );
  };

  // ── Full-screen loading state ──
  if (loading) {
    return (
      <View style={[ui.screen, ui.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[ui.caption, { marginTop: spacing.md }]}>
          Loading favourites…
        </Text>
      </View>
    );
  }

  return (
    <View style={ui.screen}>
      {/* Decorative blobs */}
      <View style={ui.blobTopRight} pointerEvents="none" />
      <View style={ui.blobBottomLeft} pointerEvents="none" />

      {/* Page header */}
      <View style={styles.header}>
        <Text style={ui.heading}>Favourites</Text>
        <Text style={[ui.subheading, { marginTop: spacing.xs }]}>
          Your saved collection
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.empty}>
            {/* Small icon placeholder */}
            <View style={styles.emptyIconWrapper}>
              <Text style={styles.emptyIcon}>♡</Text>
            </View>
            <Text style={[ui.heading, styles.emptyTitle]}>Nothing here yet</Text>
            <Text style={ui.subheading}>
              Items you favourite will appear here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Inline error banner */}
      {error && (
        <View style={ui.errorBox}>
          <Text style={ui.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Header ──
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },

  // ── List ──
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
    gap: spacing.md,          // React Native 0.71+ supports gap in FlatList contentContainerStyle
  },

  // ── Footer loader ──
  footerLoader: {
    paddingVertical: spacing.xl,
    alignSelf: 'center',
  },

  // ── Empty state ──
  empty: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  emptyIcon: {
    fontSize: 32,
    color: colors.primary,
  },
  emptyTitle: {
    // Override heading size slightly for empty state
    fontSize: typography['2xl'],
    textAlign: 'center',
  },
});