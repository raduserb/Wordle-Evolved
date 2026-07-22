import React, { useContext } from "react";
import { AppContext } from "../Training";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import { useLocation, useNavigate  } from 'react-router-dom';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, // Width of the modal
  height: 150, // Add this
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 0,
  p: 4,
  borderRadius: '16px', // Add this line
};


export default function HintModal({ open, handleClose,hintMessage }) {


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2"sx={{ textAlign: 'center' }}>
        Your best guess would be:
      </Typography>
        <Typography sx={{ mt: 1.5, textAlign: 'center', color: 'green', fontSize: '2rem', fontWeight: 'bold' }}>
          {hintMessage.toUpperCase()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3.5 }}>
          <Button startIcon={<CloseIcon />} variant="outlined" color="primary" onClick={handleClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
}
