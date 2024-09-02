// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; // Ensure the path is correct
import Home from '../Home/Home';
import PlayerHighlights from '../PlayerHighlights/PlayerHighlights';
import TeamHighlights from '../TeamHighlights/TeamHighlights';
import Favorites from '../Favorites/Favorites';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import PlayerDetails from '../PlayerDetails/PlayerDetails';
import TeamHighlightPage from '../TeamHighlightPage/TeamHighlightPage';

import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<PlayerHighlights />} />
        <Route path="/player/:playerId" element={<PlayerDetails />} />
        <Route path="/teams" element={<TeamHighlights />} />
        <Route path="/team/:teamName" element={<TeamHighlightPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;

