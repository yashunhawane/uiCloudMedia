import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  uri: string;
  style?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  nativeControls?: boolean;
  allowsFullscreen?: boolean;
  contentFit?: "contain" | "cover" | "fill";
};

export default function MediaVideo({
  uri,
  style,
  autoPlay = false,
  loop = false,
  muted = false,
  nativeControls = false,
  allowsFullscreen = false,
  contentFit = "cover",
}: Props) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = loop;
    videoPlayer.muted = muted;

    if (autoPlay) {
      videoPlayer.play();
    }
  });

  useEffect(() => {
    player.loop = loop;
    player.muted = muted;

    if (autoPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [autoPlay, loop, muted, player]);

  return (
    <VideoView
      player={player}
      style={style}
      contentFit={contentFit}
      nativeControls={nativeControls}
      allowsFullscreen={allowsFullscreen}
    />
  );
}
