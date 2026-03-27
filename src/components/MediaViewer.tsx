import React from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaItem } from "../services/mediaService";
import { ui } from "../Theam";

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={ui.viewerBackdrop}>
        <View style={ui.viewerTopBar}>
          <Pressable style={ui.viewerCloseButton} onPress={onClose}>
            <Text style={ui.viewerCloseText}>Close</Text>
          </Pressable>

          <Pressable
            style={[ui.viewerLikeButton, liked && ui.viewerLikeButtonActive]}
            onPress={() => onToggleLike(item)}
          >
            <Text style={[ui.viewerLikeText, liked && ui.viewerLikeTextActive]}>
              {liked ? "Liked" : "Like"}
            </Text>
          </Pressable>
        </View>

        <View style={ui.viewerMediaWrap}>
          {item.type === "image" ? (
            <Image
              source={{ uri: item.uri }}
              style={ui.viewerMedia}
              resizeMode="contain"
            />
          ) : (
            <View style={ui.viewerVideoPlaceholder}>
              <Text style={ui.viewerVideoIcon}>▶</Text>
              <Text style={ui.viewerVideoTitle}>Video selected</Text>
              <Text style={ui.viewerVideoHint}>
                Fullscreen video playback is not configured yet in this app.
              </Text>
            </View>
          )}
        </View>

        <View style={ui.viewerMetaPanel}>
          <View style={ui.viewerTypeChip}>
            <Text style={ui.viewerTypeChipText}>
              {item.type === "image" ? "Image" : "Video"}
            </Text>
          </View>
          <Text style={ui.viewerTimestampLarge}>{item.timestamp}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

