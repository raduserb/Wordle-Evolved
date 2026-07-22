import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';



const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  backgroundColor: 'white',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#ff00ff' : '#ff00ff',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#ff00ff'
    }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `0px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
}));


function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const PAGE_SIZE = 10;


function AdminPanel() {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState('English'); // Add a new state for the language
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [userIdToDelete, setUserIdToDelete] = React.useState(null);
  const [clickedButtons, setClickedButtons] = React.useState({});
  

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('https://localhost:7020/api/User');
      const usersWithId = response.data.map(user => ({ ...user, id: user.userId }));
      setUsers(usersWithId);
    };
  
    fetchUsers();
  }, []);
  

  const columns = [
    { field: 'id', headerName: 'id', width: 55},
    {
      field: 'userName',
      headerName: 'Username',
      width: 130,
      editable: true,
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 130 },
    {
      field: 'makeAdmin',
      headerName: 'Make Admin',
      width: 167,
      renderCell: (params) => {
        const isAdmin = params.row.role === 'admin'; // Check if user role is 'admin'
        const isOwner = params.row.role === 'owner'; // Check if user role is 'owner'
        const isClicked = clickedButtons[params.row.id];

        return (
          <Button
            variant={isAdmin ? 'contained' : 'outlined'}
            color={isAdmin ? 'success' : 'secondary'}
            style={{
              backgroundColor: isClicked || isOwner ? 'gray' : isAdmin ? 'red': 'green',
              color: 'white', // Set text color to white
            }}
            onClick={() => {
              if (isAdmin) {
                removeAdmin(params.row.id);
                params.row.role = 'user+';
              }
              else
              {
                handleMakeAdminClick(params.row.id);
                params.row.role = 'admin';
              }
              setClickedButtons({
                ...clickedButtons,
                [params.row.id]: true,
              });
            }}
            disabled={isOwner || isClicked} // Disable the button if already clicked or admin
          >
            { isClicked ? 'Done' : isAdmin ? 'Remove Admin' : isOwner ? 'Owner': 'Make Admin'}
          </Button>
        );
      },
    },    
    {
      field: 'delete',
      headerName: '',
      width: 65,
      renderCell: (params) => {
        if (userRole === 'owner') {
          return (
            <IconButton
              aria-label="delete"
              onClick={() => {
                // handleDeleteIconClick(params.row.id);
                setOpen(true);
                setUserIdToDelete(params.row.id);
              }}
              style={{
                color: params.row.role === 'owner' ? 'gray' : 'red',
                pointerEvents: params.row.role === 'owner' ? 'none' : 'auto',
              }}
              disabled={params.row.role === 'owner'} // Add this line to disable the button
            >
              <DeleteIcon />
            </IconButton>
          );
        } else {
          return (
            <IconButton
              aria-label="delete"
              onClick={() => {
                setOpen(true);
                setUserIdToDelete(params.row.id);
              }}
              style={{ color: 'gray', pointerEvents: 'none', opacity: 0.5 }}
              disabled // Add this line to disable the button
            >
              <DeleteIcon />
            </IconButton>
          );
        }
      },
    }
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });

  const handleMakeAdminClick = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7020/api/User/${userId}/makeadmin`, {
          method: 'PUT',
          headers: {
            'accept': 'text/plain',
            // Add any other necessary headers (e.g., authorization token)
          },
        });

        if (response.ok) {
          // User successfully promoted to admin
          console.log('User is now an admin');
        } else {
          // Handle error response (e.g., display an error message)
          console.error('Error promoting user to admin');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    async function removeAdmin(userId) {
      try {
        const url = `https://localhost:7020/api/User/${userId}/removeadmin`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'accept': 'text/plain',
            // Add any other necessary headers (e.g., authorization token)
          },
        });
    
        if (response.ok) {
          console.log('User is no longer an admin');
        } else {
          console.error('Error removing admin privileges');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }


  const handleDeleteIconClick = async () => {
    try {
      // Make the DELETE request to the API
      await axios.delete(`https://localhost:7020/api/User/${userIdToDelete}`);
  
      // Update your state to remove the deleted user
      setUsers(users.filter(user => user.id !== userIdToDelete));
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle any error scenarios (e.g., show an error message)
    }
  };

  const handleWordChange = (event) => {
    setWord(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let enter = true;

    if(word.length !== 5) {
      setMessage('Word must have 5 characters');
      enter = false;
    }

    if(enter){
      try {
        // Determine the languageId based on the selected language
        const languageId = language === 'English' ? 1 : 2;
    
        // Check if the word exists in the database for the specific language
        const wordResponse = await axios.get(`https://localhost:7020/api/Word/word/${word}/${languageId}`);
        if (wordResponse.status === 404) {
          setMessage('Word does not exist in the database for the selected language');
          console.log('Word does not exist in the database for the selected language');
          return;
        }
      }catch (error) {
        setMessage('Word does not exist in the database for the selected language');
        enter = false;
      }
    }

    if(enter){
      try {
        // Determine the languageId based on the selected language
        const languageId = language === 'English' ? 1 : 2;
    
        // If the word exists, update it
        const response = await axios.put(`https://localhost:7020/api/Word/${languageId}`, {
          wordId: languageId,
          languageId: languageId,
          value: word
        });
        if (response.status === 204) {
          setMessage('Word updated successfully');
        } else {
          setMessage('Failed to update word');
        }
      } catch (error) {
        setMessage('An error occurred while updating the word');
      }
    }

    setTimeout(() => {
      setMessage('');
    }, 3000); // 3000 milliseconds = 3 seconds
  };
  
  const languageOptions = [
    {
      value: 'English',
      label: 'English',
    },
    {
      value: 'Romanian',
      label: 'Romanian',
    },
  ];

  return (
    
    <div>
      <h2 style={{ color: 'white', textAlign: 'center', fontFamily: 'Cursive', fontSize: '3em' }}>Admin Panel</h2>
      <hr style={{ width: '60%', margin: '0 auto' }} />
      <h2 style={{ color: 'white', textAlign: 'center', fontFamily: 'Cursive', fontSize: '2em' }}>Set Today's Word</h2>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <label style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="outlined-basic"
              label="Word"
              variant="outlined"
              value={word}
              onChange={handleWordChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: '#1c1c1c',
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
              }}
            />
        </label>
        <label style={{ display: 'flex', justifyContent: 'center' }}>
          <Box component="form" sx={{ '& .MuiTextField-root': {  width: '15ch',marginLeft: '8px' } }} noValidate autoComplete="off">
            <TextField
              id="outlined-select-language"
              select
              label="Select Language"
              value={language}
              onChange={handleLanguageChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: '#1c1c1c',
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
              }}
              >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
          <Button
            type="submit"
            variant="contained"
            color="success" // Set the button color to green
            startIcon={<ArrowUpwardIcon />} // Add the ArrowUpwardIcon
            sx={{
              fontSize: '15px', // Increase the font size
              padding: '10px 25px', // Adjust the padding
            }}
          >
            Submit
          </Button>
        </div>
      </form>
      <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }} spacing={2}>
        {message && (
          <Alert variant="filled" severity={message === 'Word updated successfully' ? 'success' : 'error'}>
            {message}
          </Alert>
        )}
      </Stack>
      <h2 style={{ color: 'white',textAlign: 'center', fontFamily: 'Cursive', fontSize: '2em' }}>Users Table</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StyledDataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[PAGE_SIZE]}
          slots={{
            pagination: CustomPagination,
          }}
          rows={users}
          columns={columns}
        />
      </div>
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
              <DialogTitle>
                <WarningRoundedIcon />
                Confirmation
              </DialogTitle>
              <Divider />
              <DialogContent>
                Are you sure you want to delete this user?
              </DialogContent>
              <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                style={{ backgroundColor: '#FF0000' }}
                startIcon={<DeleteIcon />}
                onClick={() => {handleDeleteIconClick(); setOpen(false)}}
              >
                Delete
              </Button>
                <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogActions>
            </ModalDialog>
          </Modal>
    </div>
  );
}

export default AdminPanel;
