import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing, ui } from "../../src/Theam";

// ─── Layout constants ─────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_GAP = spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - COLUMN_GAP) / 2;

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaItem = {
  id: string;
  type: "image" | "video";
  uri: string;
  width: number;
  height: number;
  timestamp: string;
};

// ─── Static mock data (replace with real API) ────────────────────────────────
const PAGE_SIZE = 10;

const ALL_MOCK_ITEMS: MediaItem[] = Array.from({ length: 60 }, (_, i) => ({
  id: `item-${i + 1}`,
  type: i % 7 === 0 ? "video" : "image",
  uri: `https://picsum.photos/seed/${i + 10}/${300 + ((i * 37) % 200)}/${300 + ((i * 53) % 200)}`,
  width: 300 + ((i * 37) % 200),
  height: 300 + ((i * 53) % 200),
  timestamp: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  }),
}));

const fetchPage = (page: number): Promise<{ data: MediaItem[]; hasMore: boolean }> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const data = ALL_MOCK_ITEMS.slice(start, start + PAGE_SIZE);
      resolve({ data, hasMore: start + PAGE_SIZE < ALL_MOCK_ITEMS.length });
    }, 800)
  );

// ─── MediaCard ────────────────────────────────────────────────────────────────
const MediaCard = React.memo(({ item }: { item: MediaItem }) => {
  const cardHeight = CARD_WIDTH * (item.height / item.width);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  const onLoad = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        ui.mediaCard,
        { width: CARD_WIDTH, height: cardHeight },
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} style={{ flex: 1 }}>
        <Image source={{ uri: item.uri }} style={ui.mediaCardImage} onLoad={onLoad} resizeMode="cover" />

        <View style={ui.mediaCardOverlay} />

        {item.type === "video" && (
          <View style={ui.videoBadge}>
            <Text style={ui.videoBadgeText}>▶</Text>
          </View>
        )}

        <View style={ui.mediaCardMeta}>
          <Text style={ui.mediaCardTimestamp}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});
MediaCard.displayName = "MediaCard";

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = ({ height }: { height: number }) => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        ui.mediaCard,
        { width: CARD_WIDTH, height, opacity: pulse, backgroundColor: colors.border },
      ]}
    />
  );
};

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
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fabAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    loadMore(true);
  }, []);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(fabAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const loadMore = useCallback(
    async (reset = false) => {
      if (loading) return;
      if (!reset && !hasMore) return;

      setLoading(true);
      const nextPage = reset ? 1 : page + 1;
      const result = await fetchPage(nextPage);

      setItems((prev) => (reset ? result.data : [...prev, ...result.data]));
      setPage(nextPage);
      setHasMore(result.hasMore);
      setLoading(false);
      setInitialLoad(false);
    },
    [loading, hasMore, page]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadMore(true);
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) loadMore();
  }, [loading, hasMore, loadMore]);

  // Pair items into two-column rows
  const rows: [MediaItem | null, MediaItem | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i] ?? null, items[i + 1] ?? null]);
  }

  const renderRow = ({ item: row }: { item: [MediaItem | null, MediaItem | null] }) => (
    <View style={ui.gridRow}>
      {row[0] && <MediaCard item={row[0]} />}
      {row[1] ? <MediaCard item={row[1]} /> : <View style={{ width: CARD_WIDTH }} />}
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
            {items.length > 0 ? `${ALL_MOCK_ITEMS.length} memories` : "Loading…"}
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
              <Text style={{ fontSize: 48 }}>🖼️</Text>
              <Text style={[ui.subheading, { marginTop: spacing.md, textAlign: "center" }]}>
                No media yet.{"\n"}Upload something!
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <Animated.View style={[ui.fab, { transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity
          style={ui.fabBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/upload")}
        >
          <Text style={ui.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}