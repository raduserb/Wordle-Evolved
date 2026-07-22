import React, { useState, useEffect,createContext } from 'react';
import axios from 'axios';
import './Training.css';
import Board from "./subcomponents/Board";
import GameOver from "./subcomponents/GameOver";
import Keyboard from "./subcomponents/Keyboard";
import { boardDefault,generateWordSet } from './Words'
import { useLocation } from 'react-router-dom';
import { FaLightbulb } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FlagIcon from '@mui/icons-material/Flag';
import BasicModal from "./subcomponents/GameOver";
import HintModal from "./subcomponents/HintModal";
import PossibleWordsModal from "./subcomponents/PossibleWordsModal";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

export const AppContext = createContext();

function Play() {
  const [board,setBoard] = useState(boardDefault);
  const [currAttempt,setCurrAttempt] = useState({attempt: 0, letterPos: 0});
  const [wordSet, setWordSet] = useState(new Set() );
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState('' ); 
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false});
  const [triedWords, setTriedWords] = useState([]); // Add this line
  const location = useLocation();
  const language = location.state.language;
  const [hintVisible, setHintVisible] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [flip, setFlip] = useState(false);
  const [gameOver2, setGameOver2] = useState(false);
  const [possibleWords, setPossibleWords] = useState([]);
  const [possibleWordsVisible, setPossibleWordsVisible] = useState(false);
  const userRole = localStorage.getItem('role');
  

    useEffect(() => {
      setTriedWords([]);
      setDisabledLetters([]);
      setAlmostLetters([]);
      setCorrectLetters([]);
      setBoard(boardDefault);
      setBoard( [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ]);

      console.log('board:', board);
    }, []);


  const onEnter = async () => {
    if(currAttempt.letterPos !== 5) return;

    
    let currentWord = "";
    for(let i=0; i<5; i++) {
      currentWord += board[currAttempt.attempt][i];
    }
    console.log('Correct word:', correctWord.toLowerCase(),'current word' ,currentWord.toLowerCase());

    let validWord = true;

    if(wordSet.has(currentWord.toLowerCase())) {
      setCurrAttempt({attempt: currAttempt.attempt + 1, letterPos: 0})
      setTriedWords([...triedWords, currentWord]); // Add this line
      
      setFlip(true);
      setTimeout(() => setFlip(false), 10000); // Reset flip after 1
      validWord = true;
    }
    else {
      validWord = false;
      setShake(true);
      setTimeout(() => setShake(false), 10000); // Reset shake after 1 
    }

    console.log('Tried words:', triedWords);

    if(currentWord.toLowerCase() === correctWord.toLowerCase()) {
      setGameOver({ gameOver: true, guessedWord: true });

      setTimeout(() => {
        setGameOver2(true);
      }, 2500);
      return;
    };
  
    if(currAttempt.attempt === 5 && validWord) {
      setGameOver({gameOver: true, guessedWord: false})
      setTimeout(() => {
        setGameOver2(true);
      }, 2500);
    }
  };

  const onDelete = () => {
    if(currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos -1] = "";
    setBoard(newBoard);
    setCurrAttempt({...currAttempt, letterPos: currAttempt.letterPos - 1})
  };

  const onSelectLetter = (keyVal) => {
    if(currAttempt.letterPos > 4 || gameOver.gameOver) return;
    const currBoard = [...board]
    currBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal
    setBoard(currBoard)
    setCurrAttempt({...currAttempt, letterPos: currAttempt.letterPos + 1})
  };

  const handleHintClick = (event) => {
    // Assume correctWord and triedWords are defined and available in the scope
    const words = [correctWord, ...triedWords].map(word => word.toLowerCase()).join(',');

    // Make a GET request to the Flask API
    const apiUrl = language === 2 ? '/api/run_algorithm_ro' : '/api/run_algorithm';
    fetch(`http://127.0.0.1:5000${apiUrl}?words=${words}`)
        .then(response => response.json())
        .then(data => {
            // Log the result
            setHintMessage(data.final_guess);
            setHintVisible(true);
        })
        .catch(error => {
            console.error('Error fetching hint:', error);
        });
    
    event.currentTarget.blur();
};

const handlePossibleWordsClick = (event) => {
  // Assume correctWord and triedWords are defined and available in the scope
  const words = [correctWord, ...triedWords].map(word => word.toLowerCase()).join(',');

  // Make a GET request to the Flask API
  const apiUrl = language === 2 ? '/api/get_possible_words_ro' : '/api/get_possible_words';
  fetch(`http://127.0.0.1:5000${apiUrl}?words=${words}`)
      .then(response => response.json())
      .then(data => {
          // Log the result (up to 10 possible words)
          console.log("Possible words:", data.possible_words);
          // Handle the data as needed (e.g., display the words to the user)
          setPossibleWords(data.possible_words);
          setPossibleWordsVisible(true);
      })
      .catch(error => {
          console.error('Error fetching possible words:', error);
      });
  
  event.currentTarget.blur();
};



  const handleGiveUpClick = () => {
      setGameOver2(true)
    }


  useEffect(() => {

    generateWordSet(language).then((words) => { 
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord)
    });

  }, []); // Empty dependency array means this effect runs once after the component mounts

  useEffect(() => {
    if (gameOver.gameOver) {
      setTimeout(() => {
      }, 2500);
    }
  }, [gameOver.gameOver]);

  return (
    <div>
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value={{
        board, setBoard, currAttempt, setCurrAttempt, onSelectLetter, onEnter, onDelete, correctWord,
        setDisabledLetters, disabledLetters, setAlmostLetters, almostLetters, correctLetters, setCorrectLetters,
        setGameOver, gameOver, shake,setShake,flip,setFlip
      }}>
        <div className="game">
          <Board />
          <div>
          <Button
            variant="contained"
            style={{
              backgroundColor: userRole === 'user' ? '#444' : 'green',
              color: 'white',
              top: '120px', // Move it down by 20 pixels (adjust as needed)
              left: '-103px', // Move it left by 10 pixels (adjust as needed)
              pointerEvents: userRole === 'user' ? 'none' : 'auto',
            }}
            onClick={handleHintClick}
            type="button"
            tabIndex="-1"
          >
            <FaLightbulb />
            Hint
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#DAA520',
              color: 'white',
              position: 'relative',
              top: '120px',
              left: '-95px',
            }}
            onClick={handlePossibleWordsClick} // Add your click handler function
            type="button"
            tabIndex="-1"
          >
            <QuestionMarkIcon /> {/* Use the QuestionMarkIcon */}
            Possible Words
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: 'red', // Customize the color as needed
              color: 'white',
              position: 'relative',
              top: '120px',
              left: '103px',
            }}
            onClick={handleGiveUpClick} // Add your click handler function
          >
            <FlagIcon /> {/* Use the FlagIcon */}
            Give Up
          </Button>
          </div>
          <Keyboard />
        </div>
        <BasicModal open={gameOver2}/>
        <HintModal open={hintVisible} handleClose={() => setHintVisible(false)} hintMessage={hintMessage}/>
        <PossibleWordsModal open={possibleWordsVisible} handleClose={() => setPossibleWordsVisible(false)} possibleWords={possibleWords}/>
      </AppContext.Provider>
    </div>
  );
}

export default Play;
