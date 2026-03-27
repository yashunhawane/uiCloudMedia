import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MediaCard from '../../src/components/MediaCard';
import { getFavorites, MediaItem } from '../../src/services/mediaService';

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

      const { data, hasMore: more } = await getFavorites(page, 'image');

      setHasMore(more);
      setMedia(isRefresh ? data : [...media, ...data]);
      setPage(isLoadMore ? page + 1 : 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
      console.error('Load favorites error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page, media]);

  useEffect(() => {
    loadFavorites();
  }, []);

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
    return <ActivityIndicator style={styles.footerLoader} />;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No favorites yet</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  footerLoader: {
    padding: 20,
    alignSelf: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  error: {
    padding: 15,
    backgroundColor: '#fee',
    borderTopWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c33',
    textAlign: 'center',
  },
});

