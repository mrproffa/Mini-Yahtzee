import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../style/style';

const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const SUM_FOR_BONUS = 63;
const BONUS = 35;

export default function Gameboard({ route }) {
    const { playerName } = route.params;
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [sum, setSum] = useState(0);
    const [status, setStatus] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [usedNbrs, setUsedNbrs] = useState(new Array(6).fill(false));
    const [board, setBoard] = useState(new Array(NBR_OF_DICES).fill("dice-1"));

    const diceRow = [];
    const nbrRow = [];

    useEffect(() => {
        if (gameOver()) {
            saveScore();
        }
    }, [nbrOfThrowsLeft, usedNbrs]);

    const gameOver = () => usedNbrs.every(x => x);

    const saveScore = async () => {
        const score = { playerName, date: new Date().toLocaleString(), points: sum + (sum >= SUM_FOR_BONUS ? BONUS : 0) };
        try {
            let scores = await AsyncStorage.getItem('scores');
            scores = scores ? JSON.parse(scores) : [];
            scores.push(score);
            await AsyncStorage.setItem('scores', JSON.stringify(scores));
            setStatus("Score saved!");
        } catch (error) {
            console.log("Error saving score", error);
        }
    };

    function checkBonus() {
        if (sum >= SUM_FOR_BONUS) {
            return "You got the Bonus!";
        } else {
            return `You are ${SUM_FOR_BONUS - sum} points away from bonus.`;
        }
    }

    function throwDices() {
        if (nbrOfThrowsLeft > 0 && !gameOver()) {
            const newBoard = board.map((value, i) => (
                !selectedDices[i] ? 'dice-' + (Math.floor(Math.random() * 6) + 1) : value
            ));
            setBoard(newBoard);
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
            setStatus('Throw again or select a number');
        } else if (gameOver()) {
            newGame();
        }
    }

    const newGame = () => {
        setSum(0);
        setUsedNbrs(new Array(6).fill(false));
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setStatus("New game started");
    };

    for (let i = 0; i < NBR_OF_DICES; i++) {
        diceRow.push(
            <Pressable key={"row" + i} onPress={() => {
                const newSelection = [...selectedDices];
                newSelection[i] = !newSelection[i];
                setSelectedDices(newSelection);
            }}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"icon" + i}
                    size={65}
                    color={selectedDices[i] ? "black" : "steelblue"}
                />
            </Pressable>
        );
    }

    for (let i = 0; i < 6; i++) {
        nbrRow.push(
            <View style={styles.numbers} key={"nbrRow" + i}>
                <Text style={styles.nbrSum}>{sum}</Text>
                <Pressable
                    onPress={() => {
                        if (!usedNbrs[i]) {
                            const newUsedNbrs = [...usedNbrs];
                            newUsedNbrs[i] = true;
                            setUsedNbrs(newUsedNbrs);
                            const selectedDiceSum = board.reduce((acc, dice) => {
                                const diceValue = parseInt(dice.split('-')[1]);
                                return diceValue === i + 1 ? acc + diceValue : acc;
                            }, 0);
                            setSum(sum + selectedDiceSum);
                            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
                            setNbrOfThrowsLeft(NBR_OF_THROWS);
                            setStatus("Points saved. Throw again.");
                        } else {
                            setStatus("You have already selected this number.");
                        }
                    }}
                >
                    <MaterialCommunityIcons
                        name={'numeric-' + (i + 1) + '-circle'}
                        size={50}
                        color={usedNbrs[i] ? "black" : "steelblue"}
                    />
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.gameboard}>
            <View style={[styles.flex, styles.dropShadow]}>{diceRow}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable style={[styles.button, styles.dropShadow]} onPress={throwDices}>
                <Text style={styles.buttonText}>
                    {gameOver() ? 'New Game' : 'Throw dices'}
                </Text>
            </Pressable>
            <Text style={[styles.gameinfo, styles.gamevalue]}>Total: {sum}</Text>
            <Text style={styles.gameinfo}>{checkBonus()}</Text>
            <View style={[styles.flex, styles.dropShadow]}>{nbrRow}</View>
        </View>
    );
};
