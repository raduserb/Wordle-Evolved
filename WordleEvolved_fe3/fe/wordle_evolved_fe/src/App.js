// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Welcome from './Components/Welcome/Welcome';
import Play from './Components/Play/Play';
import Achievements from './Components/Achievements/Achievements';
import Statistics from './Components/Statistics/Statistics';
import AdminPanel from './Components/AdminPanel/AdminPanel';
import Training from './Components/Training/Training';
import GameOver from './Components/GameOver/GameOver';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/play" element={<Play/>} />
        <Route path="/achievements" element={<Achievements/>} />
        <Route path="/statistics" element={<Statistics/>} />
        <Route path="/admin" element={<AdminPanel/>} />
        <Route path="/training" element={<Training/>} />
        <Route path="/gameover" element={<GameOver/>} />
      </Routes>
    </Router>
  );
}

export default App;
