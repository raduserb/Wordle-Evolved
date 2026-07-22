import React, { useState, useEffect } from "react";
import { Navigation, List, ItemLink, Title,OptionButton } from './WelcomeStyles';
import { useLocation, useNavigate  } from 'react-router-dom';
import { decodeToken } from 'react-jwt';
import './Welcome.css';
import { boardDefault,generateWordSet } from '../Play/Words'
import axios from 'axios';


function Welcome() {

  const [correctWordEn, setCorrectWordEn] = useState('');
  const [correctWordRo, setCorrectWordRo] = useState('');

  const location = useLocation();
  const token = localStorage.getItem('token');
  

  // Decode the token
  const decodedToken = decodeToken(token);

  // Now you can access the claims in your token
  const username = decodedToken.sub;
  const role = decodedToken.UserRole;

  localStorage.setItem('role', role)

  const navigate = useNavigate();

  // Add a new state for the language
  const [language, setLanguage] = useState('English');

  // Add a new state for the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isTrainingModalVisible, setIsTrainingModalVisible] = useState(false);

  const handlePlayClick = () => {
    // Toggle the visibility of the modal when the link is clicked
    setIsModalVisible(!isModalVisible);
  };

  const handleTrainingClick = () => {
    // Toggle the visibility of the modal when the link is clicked
    setIsTrainingModalVisible(!isTrainingModalVisible);
  };


  
  useEffect(() => {

    generateWordSet(1).then((words) => {
      setCorrectWordEn(words.todaysWord)
    });

    generateWordSet(2).then((words) => {
      setCorrectWordRo(words.todaysWord)
    });

  }, [language]); // This effect runs whenever 'language' changes


  const handleLanguageSelect = async (selectedLanguage) => {
    // Set the selected language and hide the modal
    let languageCode;
    let correctWord;
    if (selectedLanguage === 'English') {
      languageCode = 1;
      correctWord = correctWordEn;
    } else if (selectedLanguage === 'Romanian') {
      languageCode = 2;
      correctWord = correctWordRo;
    }
    setLanguage(languageCode);
    setIsModalVisible(false);

    const userId = localStorage.getItem('UserId');

    // Fetch the last game session with the specific language ID
    const gameSessionsResponse = await axios.get(`https://localhost:7020/api/User/${userId}/gamesessions`);
    const filteredGameSessions = gameSessionsResponse.data.filter(gs => gs.languageId === languageCode);
    let lastGameSession
    if(filteredGameSessions.length !== 0){
     lastGameSession = filteredGameSessions.reduce((max, gameSession) => max.gameSessionId > gameSession.gameSessionId ? max : gameSession);
    }

    if (lastGameSession) {
        // Fetch the word from the last game session
        const wordResponse = await axios.get(`https://localhost:7020/api/GameSession/${lastGameSession.gameSessionId}/word`);

        // Check if the word from the last game session is the same as the last word
        if (wordResponse.data.value === correctWord) {
            console.log('The word from the last game session is the same as the last word!');
            //console.log(lastGameSession,  correctWord);
            const gameSessionData = {
              nrGuesses: lastGameSession.nrGuesses,
              result: lastGameSession.result
            };
            
            
            //localStorage.setItem('attempts',JSON.stringify([]));

            navigate('/gameover', { state: { gameSessionData, correctWord } });
            // Add your logic here
        } else {
            console.log('The word from the last game session is different from the last word!');
            // Navigate to the play page
            localStorage.setItem('finishedGameModal', 'false');
            navigate('/play', { state: { language: languageCode } });
        }
    } else {
        // If there's no last game session, navigate to the play page
        localStorage.setItem('finishedGameModal', 'false');
        navigate('/play', { state: { language: languageCode } });
    }
};


  const handleTrainingLanguageSelect = (selectedLanguage) => {
    // Set the selected language and hide the training modal
    let languageCode;
    if (selectedLanguage === 'English') {
      languageCode = 1;
    } else if (selectedLanguage === 'Romanian') {
      languageCode = 2;
    }
    setLanguage(languageCode);
    setIsTrainingModalVisible(false);
    navigate('/training', { state: { language: languageCode } });
  };
  

  return (
    <div>
      <Navigation>
      <h1 style={{ color: 'white', textAlign: 'center', fontFamily: 'Cursive', fontSize: '4em', marginTop: '-850px', display: 'block' }}>
          Hello, {username}!
        </h1>
        <List>
          <li>
            <ItemLink onClick={handlePlayClick}>Play Today's Wordle</ItemLink>
            {isModalVisible && (
              <div className="modal">
                <p className="prompt">Select a language:</p>
                <OptionButton onClick={() => handleLanguageSelect('English')}>English</OptionButton>
                <OptionButton onClick={() => handleLanguageSelect('Romanian')}>Romanian</OptionButton>
              </div>
            )}
          </li>
          <li>
            <ItemLink onClick={handleTrainingClick}>Wordle Training</ItemLink>
            {isTrainingModalVisible && (
              <div className="modal">
                <p className="prompt">Select a language:</p>
                <OptionButton onClick={() => handleTrainingLanguageSelect('English')}>English</OptionButton>
                <OptionButton onClick={() => handleTrainingLanguageSelect('Romanian')}>Romanian</OptionButton>
              </div>
            )}
          </li>
          <li>
            <ItemLink to="/achievements">Achievements</ItemLink>
          </li>
          <li>
            <ItemLink to="/statistics">Statistics</ItemLink>
          </li>
          {/* <li>
            <ItemLink to="/history">Game History</ItemLink>
          </li> */}
          {(role === 'admin' || role ==='owner')&& (
            <li>
              <ItemLink to="/admin">Admin Panel</ItemLink>
            </li>
          )}
          <li>
            <ItemLink onClick={() => { localStorage.clear(); }} to="/">Sign Out</ItemLink>
          </li>
        </List>
      </Navigation>
    </div>
  );
}

export default Welcome;
