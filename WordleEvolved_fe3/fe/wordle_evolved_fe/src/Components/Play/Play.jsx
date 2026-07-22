import React, { useState, useEffect,createContext } from 'react';
import axios from 'axios';
import './Play.css';
import Board from "./subcomponents/Board";
import BasicModal from "./subcomponents/GameOver";
import Keyboard from "./subcomponents/Keyboard";
import { boardDefault,generateWordSet } from './Words'
import { useLocation } from 'react-router-dom';

export const AppContext = createContext();

function Play() {

  const [word, setWord] = useState('');
  const [board,setBoard] = useState(boardDefault);
  const [currAttempt,setCurrAttempt] = useState({attempt: 0, letterPos: 0});
  const [wordSet, setWordSet] = useState(new Set() );
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState('' ); 
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false});
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const location = useLocation();
  const language = location.state.language;
  const [shake, setShake] = useState(false);
  const [flip, setFlip] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const alertUser = (e) => {
        e.preventDefault();
        return e.returnValue = 'Are you sure you want to leave?';
    };

    const handleBackButtonEvent = (e) => {
        if (!window.confirm('Do you want to go back?')) {
            e.preventDefault();
        }
    };

    window.addEventListener('beforeunload', alertUser);
    window.addEventListener('popstate', handleBackButtonEvent);

    return () => {
        window.removeEventListener('beforeunload', alertUser);
        window.removeEventListener('popstate', handleBackButtonEvent);
    };
}, []);

    useEffect(() => {

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

        const userId = localStorage.getItem('UserId');

        console.log('gamemodal', localStorage.getItem('finishedGameModal'));

        const fetchUserAchievements = async () => {
            try {
                const response = await axios.get(`https://localhost:7020/api/Achievement/user/${userId}`);
                setUserAchievements(response.data);
            } catch (error) {
                console.error('Failed to fetch user achievements:', error);
            }
        };

        fetchUserAchievements();

    }, []);


  const onEnter = async () => {
    if(currAttempt.letterPos !== 5) return;

    console.log('tried words:', JSON.parse(localStorage.getItem('triedWords')));

    
    let currentWord = "";
    for(let i=0; i<5; i++) {
      currentWord += board[currAttempt.attempt][i];
    }
    console.log('Correct word:', correctWord.toLowerCase(),'current word' ,currentWord.toLowerCase());

    
    let validWord = true;

    if(wordSet.has(currentWord.toLowerCase())) {
      setCurrAttempt({attempt: currAttempt.attempt + 1, letterPos: 0})
      let triedWords = JSON.parse(localStorage.getItem('triedWords'));

      triedWords.push(currentWord.toLowerCase());
      setFlip(true);
      setTimeout(() => setFlip(false), 10000); // Reset flip after 1

      localStorage.setItem('triedWords', JSON.stringify(triedWords));
      validWord = true;
    }
    else {
      validWord = false;
      setShake(true);
      setTimeout(() => setShake(false), 10000); // Reset shake after 1 
      //alert("Invalid word")
    }

    const userStatisticsId = localStorage.getItem('statisticId');
    const userId = localStorage.getItem('UserId');
    
    const wordResponse = await axios.get(`https://localhost:7020/api/Word/word/${correctWord.toLowerCase()}`);
    if (wordResponse.status !== 200) {
        console.error('Failed to get word ID:', wordResponse);
        return;
    }
    const wordId = wordResponse.data;

    let languageId = language;
    

    const userStatisticsResponse = await axios.get(`https://localhost:7020/api/UserStatistics/${userStatisticsId}`);
    const userStatistics = userStatisticsResponse.data;    

    // Fetch user game sessions
    const gameSessionsResponse = await axios.get(`https://localhost:7020/api/User/${userId}/gamesessions`);
    const gameSessions = gameSessionsResponse.data;

    if(currentWord.toLowerCase() === correctWord.toLowerCase()) {
      setGameOver({gameOver: true, guessedWord: true})
      const response = await axios.put(`https://localhost:7020/api/UserStatistics/increment/${userStatisticsId}`, true, {
          headers: { 'Content-Type': 'application/json' }
      });
          
      if (response.status !== 200) {
          console.error('Failed to increment user statistics:', response);
      }
      


    

    // Create a new game session
    const gameSessionResponse = await axios.post(`https://localhost:7020/api/GameSession/${userId}/${wordId}/${languageId}/${currAttempt.attempt + 1}/Win`);
    if (gameSessionResponse.status !== 201 && gameSessionResponse.status !== 200 ) {
        console.error('Failed to create game session:', gameSessionResponse);
    }


      //achievements
      if(userStatistics.wins === 0&& !userAchievements.some(achievement => achievement.achievementId === 1)) 
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 1
        });
      }

      if(userStatistics.wins === 9 && !userAchievements.some(achievement => achievement.achievementId === 2)) 
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 2
        });
        await axios.put(`https://localhost:7020/api/User/${userId}/makeUserPlus`);
        localStorage.setItem('role', 'user+');
      }

      if(userStatistics.wins === 99 && !userAchievements.some(achievement => achievement.achievementId === 3)) 
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 3
        });
      }

      if(currAttempt.attempt === 5 && !userAchievements.some(achievement => achievement.achievementId === 4))
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 4
        });
      }

      if((currAttempt.attempt === 1 || currAttempt.attempt === 0) && !userAchievements.some(achievement => achievement.achievementId === 7))
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 7
        });
      }

      if(currAttempt.attempt === 0 && !userAchievements.some(achievement => achievement.achievementId === 10))
      {
        await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
            statisticId: userStatisticsId,
            achievementId: 10
        });
      }

      const completedGameSessions = gameSessions.filter(session => session.result.toLowerCase() === 'win');


      if (completedGameSessions.length >= 10 && !userAchievements.some(achievement => achievement.achievementId === 11)) 
      {
        const uniqueLanguageIds = [...new Set(completedGameSessions.map(session => session.languageId))];

        if (uniqueLanguageIds.length >= 2) {
            await axios.post(`https://localhost:7020/api/UserStatisticsAchievement`, {
              statisticId: userStatisticsId,
              achievementId: 11
          });
        }
      }
      return;
    };
  
    if(currAttempt.attempt === 5 && validWord) {
      setGameOver({gameOver: true, guessedWord: false})
      const response = await axios.put(`https://localhost:7020/api/UserStatistics/increment/${userStatisticsId}`, false, {
          headers: { 'Content-Type': 'application/json' }
      });
          
      if (response.status !== 200 && response.status !== 201) {
          console.error('Failed to increment user statistics:', response);
      }

      const wordResponse = await axios.get(`https://localhost:7020/api/Word/word/${correctWord.toLowerCase()}`);
      if (wordResponse.status !== 200) {
          console.error('Failed to get word ID:', wordResponse);
          return;
      }
      const wordId = wordResponse.data;

      console.log('creating game sess with wordId', wordId);
      if(wordId!==1 && wordId !== 2) {
        const gameSessionResponse = await axios.post(`https://localhost:7020/api/GameSession/${userId}/${wordId}/${languageId}/${6}/Lose`);
        if (gameSessionResponse.status !== 201) {
            console.error('Failed to create game session:', gameSessionResponse);
        }
      }
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

  useEffect(() => {

    generateWordSet(language).then((words) => { 
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord)
    });

  }, []); // Empty dependency array means this effect runs once after the component mounts

  useEffect(() => {
    if (gameOver.gameOver) {
      setTimeout(() => {
        setOpenModal(true);
        localStorage.setItem('finishedGameModal', 'true')
      }, 2500);
    }
  }, [gameOver.gameOver]);

  return (
    <div>
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value = {{board, setBoard,currAttempt,setCurrAttempt,onSelectLetter,onEnter,onDelete,correctWord,setDisabledLetters,disabledLetters,setAlmostLetters,almostLetters,correctLetters,setCorrectLetters,setGameOver,gameOver,shake,setShake,flip,setFlip}}>
        <div className="game">
          <Board/>
          <Keyboard/> 
        </div>
      <BasicModal open={localStorage.getItem('finishedGameModal') === 'true'} />
      </AppContext.Provider>
    </div>
  );
}

export default Play;
