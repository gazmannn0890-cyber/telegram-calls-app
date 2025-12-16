import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Path, Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Компонент анимированного замка
const AnimatedLock = ({ isLocked }) => {
  const lockAnim = useRef(new Animated.Value(isLocked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(lockAnim, {
      toValue: isLocked ? 1 : 0,
      tension: 150,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [isLocked]);

  return (
    <Animated.View style={[
      styles.lockContainer,
      {
        transform: [{
          scale: lockAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 1.2, 1]
          })
        }]
      }
    ]}>
      <Svg width="24" height="24" viewBox="0 0 24 24">
        <Path
          d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"
          fill="#00c9b7"
        />
        <Animated.Path
          d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
          fill="#00c9b7"
          opacity={lockAnim}
        />
      </Svg>
    </Animated.View>
  );
};

// Компонент Telegram ракеты
const TelegramRocket = ({ isLaunching }) => {
  const rocketAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLaunching) {
      Animated.parallel([
        Animated.timing(rocketAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay: 500,
        }),
      ]
