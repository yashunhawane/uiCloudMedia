import React, { memo, useRef } from 'react';
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MediaItem } from '../services/mediaService';
import { ui } from '../Theam';
import { CARD_WIDTH } from './SkeletonCard';

interface Props {
  item: MediaItem;
  onPress?: (item: MediaItem) => void;
}

const MediaCard = memo(({ item, onPress }: Props) => {
  const safeWidth = item.width && item.width > 0 ? item.width : 1;
  const safeHeight = item.height && item.height > 0 ? item.height : safeWidth;
  const aspectRatio = safeHeight / safeWidth;
  const cardHeight = CARD_WIDTH * (aspectRatio > 0 ? aspectRatio : 1);
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
        { 
          width: CARD_WIDTH, 
          height: cardHeight 
        },
        { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }] 
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ flex: 1 }}
        onPress={() => onPress?.(item)}
      >
        <Image 
          source={{ uri: item.uri }} 
          style={ui.mediaCardImage} 
          onLoad={onLoad} 
          resizeMode="cover" 
        />
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

export default MediaCard;
