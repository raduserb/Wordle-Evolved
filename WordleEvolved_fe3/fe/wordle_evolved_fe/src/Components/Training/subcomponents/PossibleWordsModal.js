import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, // Width of the modal
  height: 'auto', // Adjust to fit content
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 0,
  p: 4,
  borderRadius: '16px', // Add this line
};

export default function PossibleWordsModal({ open, handleClose, possibleWords }) {
  // Function to group words into rows of 4
  const groupWords = (words, perRow) => {
    const groupedWords = [];
    for (let i = 0; i < words.length; i += perRow) {
      groupedWords.push(words.slice(i, i + perRow));
    }
    return groupedWords;
  };

  const groupedWords = groupWords(possibleWords, 4);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            Possible Words
        </Typography>
        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          {groupedWords.map((row, rowIndex) => (
            <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              {row.map((word, wordIndex) => (
                <Typography
                  key={wordIndex}
                  sx={{
                    color: 'green',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mx: 1,
                    bgcolor: 'grey.300',
                    borderRadius: '8px',
                    p: 1
                  }}
                >
                  {word}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3.5 }}>
          <Button startIcon={<CloseIcon />} variant="outlined" color="primary" onClick={handleClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
}
