import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
import trophy from './trophy-removebg-preview.png'; // replace with your trophy image path
import lockedTrophy from './lockedTrophy-removebg-preview.png'; // replace with your locked trophy image path

const AchievementsTable = ({ achievements, userAchievements, achievementOwnershipRates }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '60%' }}> {/* Adjust this value as needed */}
            <Typography variant="h2" gutterBottom component="div" color="white" style={{ fontFamily: 'Georgia',textAlign: 'center', marginBottom: '50px'}}>
                Achievements
            </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {achievements.map((achievement, index) => (
                                <TableRow 
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={hoveredIndex === index ? { backgroundColor: '#f0f0f0' } : {}}
                                >
                                    <TableCell>
                                        <img 
                                            src={userAchievements.some(userAchievement => userAchievement.achievementId === achievement.achievementId) ? trophy : lockedTrophy} 
                                            alt="trophy" 
                                            style={{ width: '50px', height: '50px' }} // adjust the size as needed
                                        />
                                    </TableCell>
                                    <TableCell style={{ paddingRight: '10px' }}>{achievement.achievementName}</TableCell>
                                    <TableCell style={{ width: '60%' }}>{achievement.achievementDescription}</TableCell>
                                    <TableCell>
                                        {achievementOwnershipRates[achievement.achievementName] 
                                            ? achievementOwnershipRates[achievement.achievementName].toFixed(1)
                                            : '0.0'
                                        }%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default AchievementsTable;
