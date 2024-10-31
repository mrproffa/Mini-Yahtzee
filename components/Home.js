import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const MIN_SPOT = 1;
const MAX_SPOT = 6;
const BONUS_POINTS_LIMIT = 63;
const BONUS_POINTS = 35;

export default function Home({ navigation }) {
  const [playerName, setPlayerName] = useState('');
  const [showRules, setShowRules] = useState(false);

  const handleStartGame = () => {
    Keyboard.dismiss();
    setShowRules(true); // Näytä säännöt, kun nimi on syötetty
  };

  const navigateToGameboard = () => {
    navigation.navigate('Gameboard', { playerName });
  };

  return (
    <View style={styles.container}>
      <Text>Enter your name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={playerName}
        onChangeText={setPlayerName}
        onSubmitEditing={handleStartGame}
      />
      <Button title="OK" onPress={handleStartGame} />

      {showRules && (
        <>
          <Text style={styles.gameinfo}>Rules of the game</Text>
          <Text>
            THE GAME: Upper section of the classic Yahtzee dice game. You have {NBR_OF_DICES} dices and
            for each dice you have {NBR_OF_THROWS} throws. After each throw, you can keep dices to get the same
            dice spot counts as many as possible. At the end of each turn, you must select your points from {MIN_SPOT} to {MAX_SPOT}.
            The game ends when all points have been selected. The order for selecting is free.
          </Text>
          <Text>
            POINTS: After each turn, the game calculates the sum for the selected dices with the same spot count.
            Once chosen, you cannot select the same points from {MIN_SPOT} to {MAX_SPOT} again.
          </Text>
          <Text>
            GOAL: Achieve as many points as possible. Reaching {BONUS_POINTS_LIMIT} points grants a bonus of {BONUS_POINTS} extra points.
          </Text>
          <Button title="Play" onPress={navigateToGameboard} />
        </>
      )}
    </View>
  );
}
