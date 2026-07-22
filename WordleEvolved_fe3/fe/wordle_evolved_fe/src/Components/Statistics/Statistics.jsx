import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css'; // Import the CSS file
import { ScaleLoader } from 'react-spinners';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Paper } from '@mui/material';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Flag, Segment } from 'semantic-ui-react';
import romania from './romania.png';
import england from './england.png';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { GridSortDirection } from '@mui/x-data-grid';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [gameSessions, setGameSessions] = useState(null);
    const [cal, setcal] = useState(null);
    const [winsEnglish, setWinsEnglish] = useState(0);
    const [lossesEnglish, setLossesEnglish] = useState(0);
    const [winsRomanian, setWinsRomanian] = useState(0);
    const [lossesRomanian, setLossesRomanian] = useState(0);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: PAGE_SIZE,
        page: 0,
      });


    useEffect(() => {
        const fetchStatistics = async () => {
            const userId = localStorage.getItem('UserId');
            const response = await axios.get(`https://localhost:7020/api/UserStatistics/user/${userId}`);
            setStatistics(response.data);
        };

        const fetchGameSessions = async () => {
            const userId = localStorage.getItem('UserId');
            const response = await axios.get(`https://localhost:7020/api/User/${userId}/gamesessions`);
            let sessions = response.data;

            for (let session of sessions) {
                const wordResponse = await axios.get(`https://localhost:7020/api/GameSession/${session.gameSessionId}/word`);
                session.word = wordResponse.data.value;
            }

            sessions = sessions.sort((a, b) => a.gameSessionId - b.gameSessionId);

            setGameSessions(sessions);

            const dataset = sessions.map((session, index) => ({
                name: `Game ${index + 1}`,
                Attempts: session.nrGuesses,
                Result: session.result === 'Win' ? 1 : 0,
                Language: session.languageId,
            }));
        
        
            let arr = Array(6).fill(0);

            let wE = 0;
            let lE = 0;
            let wR = 0;
            let lR = 0;
        
            // Iterate over the dataset
            for (let data of dataset) {
                // If the game was won and the number of attempts is between 1 and 6
                if (data.Result === 1 && data.Attempts >= 1 && data.Attempts <= 6) {
                    // Increment the corresponding element in the array
                    arr[data.Attempts - 1]++;
                }

                if(data.Result === 1 && data.Language === 1){
                    wE++;
                }

                if(data.Result === 0 && data.Language === 1){
                    lE++;
                }

                if(data.Result === 1 && data.Language === 2){
                    wR++;
                }

                if(data.Result === 0 && data.Language === 2){
                    lR++;
                }
            }

            setWinsEnglish(wE);
            setLossesEnglish(lE);
            setWinsRomanian(wR);
            setLossesRomanian(lR);
    
            setcal(arr);
        };

        fetchStatistics();
        fetchGameSessions();

        

    }, []);

    if (!statistics || !gameSessions) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <ScaleLoader
                color="#36d7b7"
                height={70}
                width={8}
              />
            </div>
          );
          
    }

    const columns = [
        { field: 'id', headerName: 'Game No.', width: 100 },
        { field: 'word', headerName: 'Word', width: 130 },
        { field: 'nrGuesses', headerName: 'No. of Guesses', width: 130 },
        {
            field: 'result',
            headerName: 'Result',
            width: 100,
            renderCell: (params) => (
                <div>
                    {params.row.result }
                    {params.row.result === 'Win' ? <CheckIcon style={{ position: 'relative', top: '5px', marginLeft: '35px' }} /> : <ClearIcon style={{ position: 'relative', top: '5px', marginLeft: '31px' }} />}
                    </div>
            ),
        },
        {
            field: 'languageId',
            headerName: 'Language',
            width: 90,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img src={params.row.languageId === 1 ? england : romania} alt="flag" width="25" height="20" />
                </div>
            ),
        }
        
        
    ];

    // Map the gameSessions to rows for the DataGrid
    const rows = gameSessions.map((session, index) => ({
        id: index + 1,
        word: session.word,
        nrGuesses: session.nrGuesses,
        result: session.result,
        languageId: session.languageId,
    }));

    return (
        
        <div>
            <h1 style={{ color: 'white',textAlign: 'center', fontFamily: 'Cursive', fontSize: '4em' }}>Stats</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper style={{ backgroundColor: 'white', padding: '1rem', width: '720px', height: '520px' }}>
                    <h2 style={{ textAlign: 'center' }}>Number of Attempts to Win</h2>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['1 attempt', '2 attempts', '3 attempt', '4 attempt','5 attempt','6 attempt'] }]}
                        series={[{ data: cal,color: '#107419'}]}
                        width={700}
                        height={400}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', backgroundColor: '#107419', marginRight: '0.5rem' }}></div>
                            <span>Number of Attempts</span>
                        </div>
                    </div>
                </Paper>

                <Paper style={{ backgroundColor: 'white', padding: '1rem', width: '720px', height: '470px', marginTop: '2rem' }}>
                    <h2 style={{ textAlign: 'center' }}>Wins and Losses</h2>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: winsEnglish + winsRomanian, label: 'Wins',color: '#197419'},
                                    { id: 1, value: lossesEnglish + lossesRomanian, label: 'Losses', color: '#d1001f'},
                                ],
                            },
                        ]}
                        width={700}
                        height={400}
                    />
                </Paper>
                <Paper style={{ backgroundColor: 'white', padding: '1rem', width: '720px', height: '470px', marginTop: '2rem' }}>
                <h2 style={{ textAlign: 'center' }}>Wins and Losses by Language</h2>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Wins (English)', 'Losses (English)', 'Wins (Romanian)', 'Losses (Romanian)']}]}
                    series={[{ data: [winsEnglish, lossesEnglish, winsRomanian, lossesRomanian]}]}
                    width={700}
                    height={400}
                />
            </Paper>

            <h2 style={{ color: 'white',textAlign: 'center', fontFamily: 'Cursive', fontSize: '4em' }}>Game Sessions</h2>
            <StyledDataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[PAGE_SIZE]}
          slots={{
            pagination: CustomPagination,
          }}
          rows={rows}
          columns={columns}
        />
            </div>
            
        </div>
    );
};

export default Statistics;


