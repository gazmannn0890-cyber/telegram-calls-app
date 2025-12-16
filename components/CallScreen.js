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
      ]).start();
    }
  }, [isLaunching]);

  return (
    <View style={styles.rocketContainer}>
      <Animated.View style={[
        styles.cloud,
        {
          opacity: cloudAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
          }),
          transform: [{
            scale: cloudAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1.5]
            })
          }]
        }
      ]}>
        <Icon name="cloud" size={60} color="rgba(255,255,255,0.3)" />
      </Animated.View>
      
      <Animated.View style={[
        styles.rocket,
        {
          transform: [
            {
              translateY: rocketAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [height * 0.3, -height]
              })
            },
            {
              rotate: rocketAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '15deg']
              })
            }
          ]
        }
      ]}>
        <Icon name="rocket" size={50} color="#0088cc" />
      </Animated.View>
    </View>
  );
};

// Компонент пульсирующей рамки аватарки
const PulsingAvatarBorder = ({ isCalling, size }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCalling) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCalling]);

  return (
    <Animated.View style={[
      styles.avatarBorder,
      {
        width: size + 10,
        height: size + 10,
        borderRadius: (size + 10) / 2,
        transform: [{ scale: pulseAnim }],
      }
    ]}>
      <Svg width={size + 10} height={size + 10}>
        <Circle
          cx={(size + 10) / 2}
          cy={(size + 10) / 2}
          r={size / 2 + 4}
          stroke="#0088cc"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray="5,3"
        />
      </Svg>
    </Animated.View>
  );
};

// Компонент анимированных облаков на фоне
const BackgroundClouds = ({ isVideoActive }) => {
  const cloud1Anim = useRef(new Animated.Value(0)).current;
  const cloud2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(cloud1Anim, {
            toValue: 1,
            duration: 20000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(cloud1Anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(cloud2Anim, {
            toValue: 1,
            duration: 25000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(cloud2Anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <>
      <Animated.View style={[
        styles.cloudBackground,
        {
          opacity: isVideoActive ? 0.4 : 0.2,
          transform: [{
            translateX: cloud1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, width + 100]
            })
          }]
        }
      ]}>
        <Icon name="cloud" size={80} color={isVideoActive ? "#00c9b7" : "#0088cc"} />
      </Animated.View>
      
      <Animated.View style={[
        styles.cloudBackground,
        {
          top: '30%',
          opacity: isVideoActive ? 0.3 : 0.15,
          transform: [{
            translateX: cloud2Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [width + 100, -100]
            })
          }]
        }
      ]}>
        <Icon name="cloud" size={60} color={isVideoActive ? "#00c9b7" : "#0088cc"} />
      </Animated.View>
    </>
  );
};

// Основной компонент экрана звонка
export default function CallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact, type = 'audio' } = route.params || {};
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [noiseCancellation, setNoiseCancellation] = useState('auto');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const intervalRef = useRef();
  const cameraRef = useRef();
  const longPressTimer = useRef();

  // Анимация появления
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    
    // Имитация начала звонка
    setTimeout(() => {
      setCallStatus('ringing');
      setTimeout(() => {
        setCallStatus('connected');
        startCallTimer();
      }, 3000);
    }, 1000);
  }, []);

  const startCallTimer = () => {
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setCallDuration(elapsed);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    navigation.goBack();
  };

  const toggleNoiseCancellation = () => {
    const modes = ['auto', 'high', 'low', 'off'];
    const currentIndex = modes.indexOf(noiseCancellation);
    const nextIndex = (currentIndex + 1) % modes.length;
    setNoiseCancellation(modes[nextIndex]);
  };

  const handleMicrophoneLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      toggleNoiseCancellation();
    }, 500);
  };

  const handleMicrophonePressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Панорамирование для видео-окна
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const getStatusText = () => {
    switch(callStatus) {
      case 'connecting': return 'Connecting...';
      case 'ringing': return 'Ringing...';
      case 'connected': return formatTime(callDuration);
      default: return 'Calling...';
    }
  };

  return (
    <View style={styles.container}>
      {/* Фон с облаками */}
      <BackgroundClouds isVideoActive={isVideoOn} />
      
      {/* Размытая аватарка на фоне */}
      {contact?.avatar && (
        <Image 
          source={{ uri: contact.avatar }} 
          style={styles.backgroundAvatar}
          blurRadius={30}
        />
      )}
      
      <BlurView intensity={isVideoOn ? 20 : 40} style={StyleSheet.absoluteFill} />

      {/* Основной контент */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Верхняя панель с замком и кнопкой назад */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={endCall}
          >
            <Icon name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          
          <AnimatedLock isLocked={callStatus === 'connected'} />
        </View>

        {/* Контактная информация */}
        <View style={styles.contactInfo}>
          <View style={styles.avatarWrapper}>
            <PulsingAvatarBorder 
              isCalling={callStatus === 'ringing'} 
              size={140}
            />
            <Image 
              source={{ uri: contact?.avatar || 'https://i.pravatar.cc/150' }} 
              style={styles.contactAvatar}
            />
            {isVideoOn && (
              <View style={styles.videoGlow} />
            )}
          </View>
          
          <Text style={styles.contactName}>
            {contact?.name || 'Unknown Contact'}
          </Text>
          
          <Text style={styles.status}>
            {getStatusText()}
          </Text>
          
          {/* Анимация ракеты при соединении */}
          {callStatus === 'connecting' && (
            <TelegramRocket isLaunching={true} />
          )}
        </View>

        {/* Панель управления */}
        <View style={styles.controls}>
          {/* Микрофон с долгим нажатием */}
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={() => setIsMuted(!isMuted)}
            onLongPress={handleMicrophoneLongPress}
            onPressOut={handleMicrophonePressOut}
            delayLongPress={500}
          >
            <Icon 
              name={isMuted ? "microphone-off" : "microphone"} 
              size={26} 
              color="#fff" 
            />
            {noiseCancellation !== 'auto' && (
              <View style={styles.noiseBadge}>
                <Text style={styles.noiseText}>{noiseCancellation.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Камера (только для видеозвонков) */}
          {type === 'video' && (
            <TouchableOpacity
              style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Icon 
                name={isVideoOn ? "video" : "video-off"} 
                size={26} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}

          {/* Динамик */}
          <TouchableOpacity
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <Icon 
              name={isSpeakerOn ? "volume-high" : "volume-off"} 
              size={26} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Кнопка завершения звонка */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={endCall}
          >
            <Icon name="phone-hangup" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Индикатор свайпа для переключения */}
        <View style={styles.swipeHint}>
          <Icon name="gesture-swipe-horizontal" size={20} color="rgba(255,255,255,0.3)" />
          <Text style={styles.swipeHintText}>Swipe to switch audio/video</Text>
        </View>

        {/* Окно с собственным видео */}
        {type === 'video' && isVideoOn && (
          <Animated.View
            style={[
              styles.videoPreview,
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.videoPreviewContent}>
              {cameraRef.current ? (
                <Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  type={Camera.Constants.Type.front}
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Icon name="account" size={30} color="#666" />
                </View>
              )}
              <View style={styles.videoOverlay}>
                <Text style={styles.videoLabel}>You</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeVideoButton}
              onPress={() => setIsVideoOn(false)}
            >
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Премиум-бадж для пользователей с Premium */}
        {isPremium && (
          <TouchableOpacity style={styles.premiumBadge}>
            <Icon name="crown" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundAvatar: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.3,
  },
  cloudBackground: {
    position: 'absolute',
    top: '20%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  contactInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarBorder: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  videoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 201, 183, 0.1)',
    shadowColor: '#00c9b7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  contactName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  rocketContainer: {
    position: 'absolute',
    bottom: -100,
    width: '100%',
    alignItems: 'center',
  },
  rocket: {
    position: 'absolute',
  },
  cloud: {
    position: 'absolute',
    bottom: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(0, 136, 204, 0.3)',
    borderColor: 'rgba(0, 136, 204, 0.5)',
    shadowColor: '#0088cc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  noiseBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00c9b7',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noiseText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  swipeHint: {
    alignItems: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  swipeHintText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  videoPreview: {
    position: 'absolute',
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    right: 20,
    top: 100,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: 'rgba(0, 136, 204, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoPreviewContent: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 4,
  },
  videoLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  closeVideoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
