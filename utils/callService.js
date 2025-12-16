import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';

class CallService {
  constructor() {
    this.soundObject = new Audio.Sound();
    this.callInProgress = false;
  }

  async playRingtone() {
    try {
      await this.soundObject.unloadAsync();
      await this.soundObject.loadAsync(require('../assets/sounds/ringtone.mp3'));
      await this.soundObject.setIsLoopingAsync(true);
      await this.soundObject.playAsync();
    } catch (error) {
      console.log('Error playing ringtone:', error);
    }
  }

  async stopRingtone() {
    try {
      await this.soundObject.stopAsync();
      await this.soundObject.unloadAsync();
    } catch (error) {
      console.log('Error stopping ringtone:', error);
    }
  }

  async startAudioCall() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      
      this.callInProgress = true;
      return true;
    } catch (error) {
      console.log('Error starting audio call:', error);
      return false;
    }
  }

  async startVideoCall() {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission not granted');
      }

      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      if (audioStatus !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      this.callInProgress = true;
      return true;
    } catch (error) {
      console.log('Error starting video call:', error);
      return false;
    }
  }

  async endCall() {
    try {
      await this.stopRingtone();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
      
      this.callInProgress = false;
      return true;
    } catch (error) {
      console.log('Error ending call:', error);
      return false;
    }
  }

  toggleMute() {
    // Здесь будет логика управления микрофоном
    console.log('Toggle mute');
  }

  toggleSpeaker() {
    // Здесь будет логика переключения динамика
    console.log('Toggle speaker');
  }
}

export default new CallService();