import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../style/style';

export default function Scoreboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('scores');
        if (storedScores) {
          setScores(JSON.parse(storedScores));
        }
      } catch (error) {
        console.log("Error fetching scores", error);
      }
    };
    fetchScores();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreText}>{item.playerName}</Text>
      <Text style={styles.scoreText}>{item.points}</Text>
      <Text style={styles.scoreText}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.scoreboardContainer}>
      <Text style={styles.title}>Top Scores</Text>
      <FlatList
        data={scores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
