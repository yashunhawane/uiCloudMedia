import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { colors, spacing, ui } from '../Theam';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = spacing.sm;
export const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - COLUMN_GAP) / 2;

const SkeletonCard = ({ height }: { height: number }) => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
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
        { 
          width: CARD_WIDTH, 
          height, 
          opacity: pulse, 
          backgroundColor: colors.border 
        }
      ]}
    />
  );
};

export default SkeletonCard;
