import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AchievementsTable from './AchievementsTable';

const App = () => {
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [achievementOwnershipRates, setAchievementOwnershipRates] = useState({});

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await axios.get('https://localhost:7020/api/Achievement');
                setAchievements(response.data);
                console.log('Achievements:', response.data);
            } catch (error) {
                console.error('Failed to fetch achievements:', error);
            }
        };

        const userId = localStorage.getItem('UserId');

        const fetchUserAchievements = async () => {
            try {
                const response = await axios.get(`https://localhost:7020/api/Achievement/user/${userId}`);
                setUserAchievements(response.data);
                console.log('User achievements:', response.data);
            } catch (error) {
                console.error('Failed to fetch user achievements:', error);
            }
        };

        const fetchAchievementOwnershipRates = async () => {
            try {
                const response = await axios.get('https://localhost:7020/api/UserStatisticsAchievement/achievement-ownership-rates');
                setAchievementOwnershipRates(response.data);
            } catch (error) {
                console.error('Failed to fetch achievement ownership rates:', error);
            }
        };

        fetchUserAchievements();
        fetchAchievements();
        fetchAchievementOwnershipRates();
    }, []);

    return <AchievementsTable achievements={achievements} userAchievements={userAchievements} achievementOwnershipRates={achievementOwnershipRates}/>;
};

export default App;
