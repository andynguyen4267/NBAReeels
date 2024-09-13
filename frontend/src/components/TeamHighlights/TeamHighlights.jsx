import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamHighlights.css';
import axios from 'axios';
import hawks from './assets/hawks.png';
import celtics from './assets/celtics.png';
import nets from './assets/nets.png';
import hornets from './assets/hornets.png';
import bulls from './assets/bulls.png';
import cavs from './assets/cavs.png';
import mavs from './assets/mavs.png';
import nuggets from './assets/nuggets.png';
import pistons from './assets/pistons.png';
import gsw from './assets/gsw.png';
import rockets from './assets/rockets.png';
import pacers from './assets/pacers.png';
import clippers from './assets/clippers.png';
import lakers from './assets/lakers.png';
import grizzlies from './assets/grizzlies.jpeg';
import heat from './assets/heat.png';
import bucks from './assets/bucks.png';
import twolves from './assets/twolves.jpeg';
import pelicans from './assets/pelicans.png';
import knicks from './assets/knicks.png';
import thunder from './assets/thunder.png';
import magic from './assets/magic.png';
import sixers from './assets/sixers.png';
import suns from './assets/suns.png';
import blazers from './assets/blazers.png';
import kings from './assets/kings.png';
import spurs from './assets/spurs.png';
import raptors from './assets/raptors.png';
import jazz from './assets/jazz.png';
import wizards from './assets/wizards.png';

const TeamHighlights = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('token'); // Get token for API calls

  // Fetch user's favorite teams from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          'https://nbareels-backend.onrender.com/api/favorites/teams',
          { headers: { Authorization: `Bearer ${token}` } } // Send token for auth
        );
        setFavorites(response.data); // Update the favorites state with the fetched data
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
  
    if (token) { // Make sure the token is available
      fetchFavorites();
    }
  }, [token]); // Fetch when the token changes or on page load

  // Initialize teams list
  useEffect(() => {
    const TeamsList = [
      { id: 1, name: 'Atlanta Hawks', imageUrl: hawks },
      { id: 2, name: 'Boston Celtics', imageUrl: celtics },
      { id: 3, name: 'Brooklyn Nets', imageUrl: nets },
      { id: 4, name: 'Charlotte Hornets', imageUrl: hornets },
      { id: 5, name: 'Chicago Bulls', imageUrl: bulls },
      { id: 6, name: 'Cleveland Cavaliers', imageUrl: cavs },
      { id: 7, name: 'Dallas Mavericks', imageUrl: mavs },
      { id: 8, name: 'Denver Nuggets', imageUrl: nuggets },
      { id: 9, name: 'Detroit Pistons', imageUrl: pistons },
      { id: 10, name: 'Golden State Warriors', imageUrl: gsw },
      { id: 11, name: 'Houston Rockets', imageUrl: rockets },
      { id: 12, name: 'Indiana Pacers', imageUrl: pacers },
      { id: 13, name: 'Los Angeles Clippers', imageUrl: clippers },
      { id: 14, name: 'Los Angeles Lakers', imageUrl: lakers },
      { id: 15, name: 'Memphis Grizzlies', imageUrl: grizzlies },
      { id: 16, name: 'Miami Heat', imageUrl: heat },
      { id: 17, name: 'Milwaukee Bucks', imageUrl: bucks },
      { id: 18, name: 'Minnesota Timberwolves', imageUrl: twolves },
      { id: 19, name: 'New Orleans Pelicans', imageUrl: pelicans },
      { id: 20, name: 'New York Knicks', imageUrl: knicks },
      { id: 21, name: 'Oklahoma City Thunder', imageUrl: thunder },
      { id: 22, name: 'Orlando Magic', imageUrl: magic },
      { id: 23, name: 'Philadelphia 76ers', imageUrl: sixers },
      { id: 24, name: 'Phoenix Suns', imageUrl: suns },
      { id: 25, name: 'Portland Trail Blazers', imageUrl: blazers },
      { id: 26, name: 'Sacramento Kings', imageUrl: kings },
      { id: 27, name: 'San Antonio Spurs', imageUrl: spurs },
      { id: 28, name: 'Toronto Raptors', imageUrl: raptors },
      { id: 29, name: 'Utah Jazz', imageUrl: jazz },
      { id: 30, name: 'Washington Wizards', imageUrl: wizards },
    ];

    setTeams(TeamsList);
  }, []);

  // Sort teams by favorites, bringing favorited teams to the front
  const getSortedTeams = () => {
    return [...teams].sort((a, b) => {
      const isAFavorite = favorites.includes(a.id);
      const isBFavorite = favorites.includes(b.id);

      if (isAFavorite && !isBFavorite) return -1; // a comes before b
      if (!isAFavorite && isBFavorite) return 1;  // b comes before a
      return 0; // no change in order
    });
  };

  // Toggle favorite status and send updated favorites to the backend
  const toggleFavorite = async (teamId) => {
    // Check if the team is already in the favorites list and update it
    const isFavorite = favorites.includes(teamId);
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== teamId) // Remove team from favorites
      : [...favorites, teamId];               // Add team to favorites
  
    setFavorites(updatedFavorites); // Update local state with new favorites
  
    try {
      // Send the teamId in the request body instead of the entire array
      await axios.post(
        'https://nbareels-backend.onrender.com/api/favorites/teams',
        { teamId }, // Only sending the teamId that is being added/removed
        { headers: { Authorization: `Bearer ${token}` } } // JWT token for auth
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleTeamClick = (teamName) => {
    navigate(`/team/${teamName}`);
  };

  return (
    <div className="team-highlights-container">
      {getSortedTeams().map((team) => (
        <div
          key={team.id}
          className="team-card"
          onClick={() => handleTeamClick(team.name)}
        >
          <img
            src={team.imageUrl}
            alt={`${team.name}`}
            className="team-image"
          />
          <h3 className="team-name">{team.name}</h3>
          <button
            className="favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(team.id);
            }}
          >
            {favorites.includes(team.id) ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeamHighlights;
