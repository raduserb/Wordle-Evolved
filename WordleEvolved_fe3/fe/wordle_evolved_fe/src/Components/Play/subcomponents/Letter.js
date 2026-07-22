import React, {useContext, useEffect, useState} from 'react'
import { AppContext } from '../Play'
import './Letter.css'; // Import the CSS file here

function Letter({letterPos,attemptVal}) {
  const {board, correctWord, currAttempt, setDisabledLetters, disabledLetters,setCorrectLetters,setAlmostLetters,shake,setShake, flip, setFlip} = useContext(AppContext);
  const [bounce, setBounce] = useState(false);
  const letter = board[attemptVal][letterPos];
  const correct = correctWord.toUpperCase()[letterPos] === letter
  const almost = !correct && letter !== "" && correctWord.toUpperCase().includes(letter)
  // const letterState = currAttempt.attempt > attemptVal &&  (correct ? "correct" : almost ? "almost" : "error")
  const [flipLetter, setFlipLetter] = useState(false);
  const [letterState, setLetterState] = useState("");
  useEffect(() => {
    if (letter !== "" && !correct && !almost) {
      setDisabledLetters((prev) => [...prev, letter]);
    }
    else if (letter !== "" && almost) {
      setAlmostLetters((prev) => [...prev, letter]);
    }
    else if (letter !== "" && correct) {
      setCorrectLetters((prev) => [...prev, letter]);
    }
  }, [currAttempt.attempt]);

  useEffect(() => {
    if (letter !== '' ) {
      console.log(`Bounce triggered for letter: ${letter}`);
      setBounce(true);
      const timer = setTimeout(() => {
        setBounce(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [letter]);

  useEffect(() => {
    if (shake && currAttempt.attempt === attemptVal) { // Only run the timer if shake is true and the current attempt is the same as the attempt value
      const timer = setTimeout(() => {
        setShake(false);
      }, 500); // Reset shake after 1 second
      return () => clearTimeout(timer);
    }
  }, [shake]);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (flip && currAttempt.attempt - 1 === attemptVal) {
      (async () => {
        await sleep(letterPos * 500); // Delay the start of the flip animation for this letter based on its position
        setLetterState(currAttempt.attempt > attemptVal &&  (correct ? "correct" : almost ? "almost" : "error"));
        setFlipLetter(true); // Start the flip animation for this letter
        await sleep(500); // Stop the flip animation for this letter after 1 second
        setFlipLetter(false);
        if (letterPos === correctWord.length - 1) {
          setFlip(false); // Reset flip after the last letter has flipped
        }
      })();
    }
  }, [flip]);

  return (
  <div className={`letter ${bounce ? 'bounce' : ''} ${shake && currAttempt.attempt === attemptVal ? 'shake' : ''} ${flipLetter ? 'flip' : ''}`} id = {letterState}>{letter || "\u00A0"}</div>
)
}

export default Letter;
