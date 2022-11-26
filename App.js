import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import uuid from 'react-uuid';
import React, {useState, useEffect, useRef} from 'react';
import CountDownTimer from 'react-native-countdown-timer-hooks';


export default function App() {
  const NBR_OF_DICES = 2;
  const [diceImages, setDiceImages] = useState([]);
  const [gamesStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState("Game is on...");
  const [nbrOfHits, setNbrOfHits] = useState(0);
  const [nbrOfFastReactions, setNbrOfFastReactions] = useState(0);
  const [timerEnd, setTimerEnd] = useState(false);
  const refTimer = useRef();
  const [prevHits, setPrevHits] = useState(0);
  const [prevFastHits, setPrevFastHits] = useState(0);




  function setImages(throws) {
    let images = [];
    for (let i = 0; i < throws.length; i++) {
      switch (throws[i]) {
        case 1: images[i] = require("./assets/dice-images/1.png"); break;
        case 2: images[i] = require("./assets/dice-images/2.png"); break;
        case 3: images[i] = require("./assets/dice-images/3.png"); break;
        case 4: images[i] = require("./assets/dice-images/4.png"); break;
        case 5: images[i] = require("./assets/dice-images/5.png"); break;
        case 6: images[i] = require("./assets/dice-images/6.png"); break;
        default: break;
      }
    }
    setDiceImages(images)
  }

  function throwDices() {
    let throws = [];
    for(let i = 0; i < NBR_OF_DICES; i++) {
      throws[i] = Math.floor(Math.random() * 6 + 1);
    }
    setImages(throws);
    setGameStarted(true);
    setStartTime(new Date());
  }

  function initialize() {
    let images = [];
    for(let i = 0; i < NBR_OF_DICES; i++) {
      images[i] = require("./assets/dice-images/smiley.png");
    }
    if (nbrOfHits > prevHits) {
      setPrevHits(nbrOfHits);
    } 
    if (nbrOfFastReactions > prevFastHits) {
      setPrevFastHits(nbrOfFastReactions);
    }
    setDiceImages(images);
    setNbrOfHits(0);
    setNbrOfFastReactions(0);
    setStatus("Game is on...");
    refTimer.current.resetTimer();
  }

  function checkDices() {
    if (gamesStarted) {
      if (diceImages[0] === diceImages[1]) {
        setNbrOfHits(nbrOfHits + 1);
        const reactionTime = new Date() - startTime;
        setStatus("Last reaction time: " + reactionTime + " ms");
        throwDices();
        if (reactionTime < 1000) {
          setNbrOfFastReactions(nbrOfFastReactions + 1);
        }
      } else {
        initialize();
      }
    }
  }

  const timerCallbackFunction = (timerFlag) => {
    setTimerEnd(timerFlag);
    initialize();
  }

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reaction game</Text>
      <Button
      style={styles.button}
      onPress={throwDices}
      title='Throw dices'>
      </Button>
      <View style={styles.flex}>
        {diceImages.map(dice => (
          <Image style={styles.dice} source={dice} key={uuid()}></Image>
        ))}
      </View>
      <Button
      style={styles.button}
      onPress={checkDices}
      title='Same Dices'>
      </Button>
      <Text style={styles.sum}>{status}</Text>
      <Text style={styles.sum}>Hits: {nbrOfHits}</Text>
      <Text style={styles.sum}>Fast Reactions: {nbrOfFastReactions}</Text>
     
      <View style={{ display: timerEnd ? 'none' : 'flex' }}>
        <CountDownTimer
          ref={refTimer}
          timestamp={60}
          timerCallback={timerCallbackFunction}
          containerStyle={{
            height: 45,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 35,
            backgroundColor: '#2196f3',
            marginTop: 15,
          }}
          textStyle={{
            fontSize: 25,
            color: '#FFFFFF',
            fontWeight: '400',
            letterSpacing: 0.25,
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          display: timerEnd ? 'flex' : 'none',
          height: 45,
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 35,
          backgroundColor: '#512da8',
          marginTop: 15,
        }}
        onPress={() => {
          setTimerEnd(false);
          refTimer.current.resetTimer();
        }}>
        <Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }}>
          Start over
        </Text>
      </TouchableOpacity>
      <Text style={styles.sum}>Previous Hits High Score: {prevHits}</Text>
      <Text style={styles.sum}> Fast Reactions High Score: {prevFastHits}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    marginTop: 100,
    marginBottom: 30,
  },
  button: {
    marginTop: 30,
    marginBottom: 30,
  },
  flex: {
    flexDirection: 'row',
  },
  dice: {
    width: 80,
    height: 80,
    marginTop: 30,
    marginBottom: 15,
    marginRight:10,
  },
  sum: {
    fontSize: 20,
    marginTop: 10,
  }
});
