import React, { useContext } from "react";
import { AppContext } from "../Play";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useLocation, useNavigate  } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, // Width of the modal
  height: 200, // Add this
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 0,
  p: 4,
  borderRadius: '16px', // Add this line
};


export default function BasicModal({ open, handleClose }) {
  const {
        currAttempt,
        gameOver,
        correctWord,
      } = useContext(AppContext);

  
  const navigate = useNavigate();

  const handleStats = () => {
    navigate('/statistics')
  };

  const handleGoBack = () => {
    navigate('/welcome')
  };

  const handleAchievements = () => {
    navigate('/achievements')
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2"sx={{ textAlign: 'center' }}>
        {gameOver.guessedWord ? 
          `You Guessed the Wordle in ${currAttempt.attempt} attempts` : 
          "You Failed to Guess the Word"}
      </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 4 }}>
          The correct word was: 
        </Typography>
        <Typography sx={{ mt: 1.5, textAlign: 'center', color: 'green', fontSize: '2rem', fontWeight: 'bold' }}>
          {correctWord.toUpperCase()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3.5 }}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" color="primary" onClick={handleGoBack}>Go Back</Button>
          <Button startIcon={<EmojiEventsIcon />} variant="outlined" color="primary" onClick={handleAchievements}>Achievements</Button>
          <Button startIcon={<LeaderboardIcon />} variant="outlined" color="primary" onClick={handleStats}>See Stats</Button>
        </Box>
      </Box>
    </Modal>
  );
}