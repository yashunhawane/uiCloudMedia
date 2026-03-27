import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing, typography, ui } from "../Theam";
import { MediaItem } from "../services/mediaService";
import MediaVideo from "./MediaVideo";

interface MediaViewerProps {
  item: MediaItem | null;
  visible: boolean;
  liked: boolean;
  onClose: () => void;
  onToggleLike: (item: MediaItem) => void;
}

export default function MediaViewer({
  item,
  visible,
  liked,
  onClose,
  onToggleLike,
}: MediaViewerProps) {
  if (!item) return null;

  const isImage = item.type === "image";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* ── Backdrop ── */}
      <SafeAreaView style={styles.backdrop}>

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          {/* Close — ghost/secondary style */}
          <Pressable
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && ui.buttonPressed,
            ]}
            onPress={onClose}
            hitSlop={8}
          >
            <Text style={styles.closeBtnText}>✕  Close</Text>
          </Pressable>

          {/* Like — primary when active, outlined when not */}
          <Pressable
            style={({ pressed }) => [
              styles.likeBtn,
              liked ? styles.likeBtnActive : styles.likeBtnIdle,
              pressed && ui.buttonPressed,
            ]}
            onPress={() => onToggleLike(item)}
            hitSlop={8}
          >
            <Text
              style={[
                styles.likeBtnText,
                liked ? styles.likeBtnTextActive : styles.likeBtnTextIdle,
              ]}
            >
              {liked ? "♥  Liked" : "♡  Like"}
            </Text>
          </Pressable>
        </View>

        {/* ── Media area ── */}
        <View style={styles.mediaWrap}>
          {isImage ? (
            <Image
              source={{ uri: item.uri }}
              style={styles.media}
              resizeMode="contain"
            />
          ) : (
            <MediaVideo
              uri={item.uri}
              style={styles.media}
              autoPlay={visible}
              nativeControls
              allowsFullscreen
              contentFit="contain"
            />
          )}
        </View>

        {/* ── Meta panel ── */}
        <View style={styles.metaPanel}>
          {/* Type chip */}
          <View style={[styles.typeChip, isImage ? styles.typeChipImage : styles.typeChipVideo]}>
            <Text style={styles.typeChipText}>
              {isImage ? "📷  Image" : "🎬  Video"}
            </Text>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── Backdrop ──────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(26, 26, 46, 0.96)",   // colors.textPrimary at high opacity
    justifyContent: "space-between",
  },

  // ── Top bar ───────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  // Close button — outlined ghost
  closeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  closeBtnText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    letterSpacing: typography.wide,
  },

  // Like button — idle
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  likeBtnIdle: {
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "transparent",
  },
  likeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  likeBtnText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    letterSpacing: typography.wide,
  },
  likeBtnTextIdle: {
    color: colors.textInverse,
  },
  likeBtnTextActive: {
    color: colors.textInverse,
  },

  // ── Media area ────────────────────────────────
  mediaWrap: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    ...shadows.lg,
  },
  media: {
    width: "100%",
    height: "100%",
  },

  // ── Meta panel ────────────────────────────────
  metaPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  // Type chip
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  typeChipImage: {
    backgroundColor: colors.accentBlue,       // soft blue for images
  },
  typeChipVideo: {
    backgroundColor: colors.accentCoral,      // soft coral for video
  },
  typeChipText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    letterSpacing: typography.wider,
    textTransform: "uppercase",
  },

  // Timestamp
  timestamp: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: typography.normal,
  },
});