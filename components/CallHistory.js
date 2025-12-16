import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';

const callHistory = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    type: 'video',
    time: 'Today, 14:30',
    duration: '5:24',
    status: 'incoming',
    missed: false,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?img=5',
    type: 'audio',
    time: 'Yesterday, 18:15',
    duration: '12:45',
    status: 'outgoing',
    missed: false,
  },
  {
    id: '3',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=8',
    type: 'video',
    time: 'Yesterday, 15:00',
    duration: 'Missed',
    status: 'incoming',
    missed: true,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    type: 'audio',
    time: 'Nov 12, 11:20',
    duration: '3:15',
    status: 'outgoing',
    missed: false,
  },
];

export default function CallHistory() {
  const navigation = useNavigation();
  const [history, setHistory] = useState(callHistory);

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        style={styles.swipeAction}
        onPress={() => navigation.navigate('CallScreen', {
          contact: item,
          type: item.type
        })}
      >
        <Icon name="phone" size={24} color="#fff" />
        <Text style={styles.swipeActionText}>Call</Text>
      </TouchableOpacity>
    );
  };

  const renderCallItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
    >
      <TouchableOpacity style={styles.callItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.callInfo}>
          <View style={styles.callHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[
              styles.duration,
              item.missed && styles.missedText
            ]}>
              {item.duration}
            </Text>
          </View>
          
          <View style={styles.callDetails}>
            <View style={styles.typeContainer}>
              <Icon 
                name={item.type === 'video' ? 'video' : 'phone'} 
                size={14} 
                color={item.missed ? '#ff3b30' : '#666'} 
              />
              <Text style={[
                styles.typeText,
                item.missed && styles.missedText
              ]}>
                {item.type === 'video' ? 'Video' : 'Audio'}
              </Text>
            </View>
            
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        
        <Icon
          name={
            item.status === 'incoming' 
              ? (item.missed ? 'phone-missed' : 'phone-incoming')
              : 'phone-outgoing'
          }
          size={20}
          color={item.missed ? '#ff3b30' : '#4CAF50'}
        />
      </TouchableOpacity>
    </Swipeable>
  );

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all call history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setHistory([])
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Call History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="phone-missed" size={60} color="#333" />
          <Text style={styles.emptyText}>No call history</Text>
          <Text style={styles.emptySubtext}>
            Calls you make or receive will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderCallItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity
        style={styles.startCallButton}
        onPress={() => navigation.navigate('ChatList')}
      >
        <Icon name="phone-plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    color: '#0088cc',
    fontSize: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  callInfo: {
    flex: 1,
    marginLeft: 12,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  missedText: {
    color: '#ff3b30',
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  swipeAction: {
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 8,
    marginRight: 16,
    borderRadius: 10,
  },
  swipeActionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  startCallButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});