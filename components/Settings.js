import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const [settings, setSettings] = useState({
    callsEnabled: true,
    videoQuality: 'auto', // 'auto', 'hd', 'low'
    privacy: 'contacts', // 'everyone', 'contacts', 'nobody'
    endToEndEncryption: true,
    saveToGallery: false,
    noiseCancellation: true,
    showNotifications: true,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (value) => {
    updateSetting('privacy', value);
    Alert.alert(
      'Privacy Updated',
      `Now ${value === 'everyone' ? 'everyone' : value === 'contacts' ? 'your contacts' : 'nobody'} can call you`
    );
  };

  const handleVideoQualityChange = (value) => {
    updateSetting('videoQuality', value);
  };

  const PrivacyOption = ({ value, label, description, icon }) => (
    <TouchableOpacity
      style={[
        styles.privacyOption,
        settings.privacy === value && styles.selectedOption,
      ]}
      onPress={() => handlePrivacyChange(value)}
    >
      <View style={styles.optionHeader}>
        <Icon name={icon} size={24} color="#0088cc" />
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>{label}</Text>
          <Text style={styles.optionDescription}>{description}</Text>
        </View>
        {settings.privacy === value && (
          <Icon name="check-circle" size={24} color="#0088cc" />
        )}
      </View>
    </TouchableOpacity>
  );

  const QualityOption = ({ value, label, description }) => (
    <TouchableOpacity
      style={[
        styles.qualityOption,
        settings.videoQuality === value && styles.selectedOption,
      ]}
      onPress={() => handleVideoQualityChange(value)}
    >
      <View>
        <Text style={styles.qualityLabel}>{label}</Text>
        <Text style={styles.qualityDescription}>{description}</Text>
      </View>
      {settings.videoQuality === value && (
        <Icon name="check" size={24} color="#0088cc" />
      )}
    </TouchableOpacity>
  );

  const SettingRow = ({ icon, title, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Icon name={icon} size={24} color="#0088cc" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#333', true: '#0088cc' }}
          thumbColor="#fff"
        />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <SettingRow
          icon="phone"
          title="Enable Calls"
          value={settings.callsEnabled}
          onValueChange={(value) => updateSetting('callsEnabled', value)}
        />
        
        <SettingRow
          icon="bell"
          title="Show Notifications"
          value={settings.showNotifications}
          onValueChange={(value) => updateSetting('showNotifications', value)}
        />
        
        <SettingRow
          icon="camera"
          title="Save to Gallery"
          value={settings.saveToGallery}
          onValueChange={(value) => updateSetting('saveToGallery', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Quality</Text>
        <QualityOption
          value="auto"
          label="Auto"
          description="Adjusts based on connection"
        />
        <QualityOption
          value="hd"
          label="HD"
          description="Best quality, uses more data"
        />
        <QualityOption
          value="low"
          label="Data Saver"
          description="Lower quality, saves data"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.sectionSubtitle}>Who can call you</Text>
        
        <PrivacyOption
          value="everyone"
          label="Everyone"
          description="Anyone can call you"
          icon="account-group"
        />
        
        <PrivacyOption
          value="contacts"
          label="Contacts Only"
          description="Only people in your contacts"
          icon="account"
        />
        
        <PrivacyOption
          value="nobody"
          label="Nobody"
          description="Block all calls"
          icon="account-off"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio & Video</Text>
        
        <SettingRow
          icon="microphone"
          title="Noise Cancellation"
          value={settings.noiseCancellation}
          onValueChange={(value) => updateSetting('noiseCancellation', value)}
        />
        
        <SettingRow
          icon="shield-check"
          title="End-to-end Encryption"
          value={settings.endToEndEncryption}
          onValueChange={(value) => updateSetting('endToEndEncryption', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Privacy Policy</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Terms of Service</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Contact Support</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Telegram Calls • End-to-end encrypted
        </Text>
        <Text style={styles.footerSubtext}>
          Your calls are private and secure
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  privacyOption: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: '#0088cc',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
  },
  qualityOption: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  qualityDescription: {
    fontSize: 12,
    color: '#666',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  aboutText: {
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#444',
  },
});