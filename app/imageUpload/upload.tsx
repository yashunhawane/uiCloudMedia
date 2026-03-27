import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { uploadMedia } from "../../src/services/mediaService";
import { colors, radius, shadows, spacing, typography, ui } from "../../src/Theam";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type MediaItem = {
  uri: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  file: any;
};

const { width } = Dimensions.get("window");
const PREVIEW_SIZE = width - spacing["2xl"] * 2;

export default function UploadScreen() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checkFileSize = (file: any): boolean => {
    if (file.fileSize && file.fileSize > MAX_FILE_SIZE_BYTES) {
      setError(`File exceeds ${MAX_FILE_SIZE_MB}MB limit. Please choose a smaller file.`);
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    setError(null);
    setSuccess(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.85,
      videoMaxDuration: 30,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      if (!checkFileSize(file)) return;
      const lowerUri = file.uri.toLowerCase();
      const isVideo = lowerUri.endsWith('.mp4') || lowerUri.endsWith('.mov') || lowerUri.endsWith('.avi');
      const mediaType = file.type === "video" || isVideo ? "video" : "image";
      console.log('Selected media:', { uri: file.uri, type: mediaType });
      setMedia({
        uri: file.uri,
        type: mediaType,
        width: file.width,
        height: file.height,
        file,
      });
    }
  };

  const openGallery = async () => {
    setError(null);
    setSuccess(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Gallery permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.85,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      if (!checkFileSize(file)) return;
      const lowerUri = file.uri.toLowerCase();
      const isVideo = lowerUri.endsWith('.mp4') || lowerUri.endsWith('.mov') || lowerUri.endsWith('.avi');
      const mediaType = file.type === "video" || isVideo ? "video" : "image";
      console.log('Selected media:', { uri: file.uri, type: mediaType });
      setMedia({
        uri: file.uri,
        type: mediaType,
        width: file.width,
        height: file.height,
        file,
      });
    }
  };

  const clearMedia = () => {
    setMedia(null);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!media) {
      setError("No media selected. Please pick a file first.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await uploadMedia({
        uri: media.file.uri,
        fileName: media.file.fileName || `upload.${media.file.uri.split(".").pop()}`,
        mimeType: media.file.mimeType,
      });
      setSuccess(true);
      setMedia(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ui.screen}>
      {/* Decorative blobs */}
      <View style={ui.blobTopRight} />
      <View style={ui.blobBottomLeft} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={ui.logoMark}>
            <Text style={ui.logoMarkText}>↑</Text>
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={ui.heading}>Upload</Text>
            <Text style={ui.subheading}>Photo or video · max {MAX_FILE_SIZE_MB}MB</Text>
          </View>
        </View>

        {/* Feedback */}
        {error && (
          <View style={ui.errorBox}>
            <Text style={ui.errorText}>{error}</Text>
          </View>
        )}
        {success && (
          <View style={ui.successBox}>
            <Text style={ui.successText}>Uploaded successfully 🚀</Text>
          </View>
        )}

        {/* Preview / Drop Zone */}
        {media ? (
          <View style={styles.previewCard}>
            {media.type === "image" ? (
              <Image
                source={{ uri: media.uri }}
                style={[
                  styles.previewImage,
                  media.width && media.height
                    ? { aspectRatio: media.width / media.height }
                    : null,
                ]}
                resizeMode="cover"
                onLoad={() => console.log('Image preview loaded successfully')}
                onError={(error) => console.log('Image preview error:', error.nativeEvent.error)}
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoIcon}>🎥</Text>
                <Text style={styles.videoLabel}>Video selected</Text>
                <Text style={styles.videoSub}>Ready to upload</Text>
              </View>
            )}
            {/* Clear button */}
            <Pressable style={styles.clearBtn} onPress={clearMedia}>
              <Text style={styles.clearBtnText}>✕</Text>
            </Pressable>
            {/* Type badge */}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {media.type === "image" ? "🖼 Image" : "🎬 Video"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.dropZone}>
            <Text style={styles.dropZoneIcon}>☁️</Text>
            <Text style={styles.dropZoneTitle}>No file selected</Text>
            <Text style={styles.dropZoneSub}>Use the buttons below to pick a file</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && ui.buttonPressed]}
            onPress={openCamera}
          >
            <Text style={styles.actionBtnIcon}>📷</Text>
            <Text style={styles.actionBtnText}>Camera</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && ui.buttonPressed]}
            onPress={openGallery}
          >
            <Text style={styles.actionBtnIcon}>🖼</Text>
            <Text style={styles.actionBtnText}>Gallery</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={ui.dividerRow}>
          <View style={ui.dividerLine} />
          <Text style={ui.dividerText}>then</Text>
          <View style={ui.dividerLine} />
        </View>

        {/* Upload Button */}
        <Pressable
          style={({ pressed }) => [
            ui.buttonPrimary,
            pressed && ui.buttonPressed,
            !media && styles.buttonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!media || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={ui.buttonPrimaryText}>Upload File</Text>
          )}
        </Pressable>

        {/* Info note */}
        <Text style={styles.note}>
          Supported: JPG, PNG, MP4, MOV · Max {MAX_FILE_SIZE_MB}MB · One file at a time
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing["2xl"],
    paddingBottom: spacing["4xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing["2xl"],
    marginTop: spacing.lg,
  },

  // Drop zone
  dropZone: {
    width: PREVIEW_SIZE,
    alignSelf: "center",
    height: 220,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  dropZoneIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  dropZoneTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dropZoneSub: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },

  // Preview
  previewCard: {
    width: PREVIEW_SIZE,
    alignSelf: "center",
    position: "relative",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  previewImage: {
    width: PREVIEW_SIZE,
    minHeight: 280,
    maxHeight: PREVIEW_SIZE * 1.35,
    backgroundColor: colors.border,
  },
  videoPlaceholder: {
    width: PREVIEW_SIZE,
    height: 220,
    backgroundColor: colors.accentBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: { fontSize: 48, marginBottom: spacing.sm },
  videoLabel: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  videoSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  clearBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnText: {
    color: "#fff",
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  typeBadge: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },

  // Action buttons row
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    ...shadows.sm,
  },
  actionBtnIcon: { fontSize: 24 },
  actionBtnText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },

  buttonDisabled: {
    opacity: 0.45,
    ...shadows.sm,
  },

  note: {
    marginTop: spacing.lg,
    textAlign: "center",
    fontSize: typography.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
