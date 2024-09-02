// src/components/PlayerHighlights/PlayerHighlights.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamHighlights.css';
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

  // Load the teams and store their original index
  useEffect(() => {
    const TeamsList = [
      { id: 1, name: 'Atlanta Hawks', imageUrl: hawks, isFavorite: false, originalIndex: 0 },
      { id: 2, name: 'Boston Celtics', imageUrl: celtics, isFavorite: false, originalIndex: 1 },
      { id: 3, name: 'Brooklyn Nets', imageUrl: nets, isFavorite: false, originalIndex: 2 },
      { id: 4, name: 'Charlotte Hornets', imageUrl: hornets, isFavorite: false, originalIndex: 3 },
      { id: 5, name: 'Chicago Bulls', imageUrl: bulls, isFavorite: false, originalIndex: 4 },
      { id: 6, name: 'Cleveland Cavaliers', imageUrl: cavs, isFavorite: false, originalIndex: 5 },
      { id: 7, name: 'Dallas Mavericks', imageUrl: mavs, isFavorite: false, originalIndex: 6 },
      { id: 8, name: 'Denver Nuggets', imageUrl: nuggets, isFavorite: false, originalIndex: 7 },
      { id: 9, name: 'Detroit Pistons', imageUrl: pistons, isFavorite: false, originalIndex: 8 },
      { id: 10, name: 'Golden State Warriors', imageUrl: gsw, isFavorite: false, originalIndex: 9 },
      { id: 11, name: 'Houston Rockets', imageUrl: rockets, isFavorite: false, originalIndex: 10 },
      { id: 12, name: 'Indiana Pacers', imageUrl: pacers, isFavorite: false, originalIndex: 11 },
      { id: 13, name: 'Los Angeles Clippers', imageUrl: clippers, isFavorite: false, originalIndex: 12 },
      { id: 14, name: 'Los Angeles Lakers', imageUrl: lakers, isFavorite: false, originalIndex: 13 },
      { id: 15, name: 'Memphis Grizzlies', imageUrl: grizzlies, isFavorite: false, originalIndex: 14 },
      { id: 16, name: 'Miami Heat', imageUrl: heat, isFavorite: false, originalIndex: 15 },
      { id: 17, name: 'Milwaukee Bucks', imageUrl: bucks, isFavorite: false, originalIndex: 16 },
      { id: 18, name: 'Minnesota Timberwolves', imageUrl: twolves, isFavorite: false, originalIndex: 17 },
      { id: 19, name: 'New Orleans Pelicans', imageUrl: pelicans, isFavorite: false, originalIndex: 18 },
      { id: 20, name: 'New York Knicks', imageUrl: knicks, isFavorite: false, originalIndex: 19 },
      { id: 21, name: 'Oklahoma City Thunder', imageUrl: thunder, isFavorite: false, originalIndex: 20 },
      { id: 22, name: 'Orlando Magic', imageUrl: magic, isFavorite: false, originalIndex: 21 },
      { id: 23, name: 'Philadelphia 76ers', imageUrl: sixers, isFavorite: false, originalIndex: 22 },
      { id: 24, name: 'Phoenix Suns', imageUrl: suns, isFavorite: false, originalIndex: 23 },
      { id: 25, name: 'Portland Trail Blazers', imageUrl: blazers, isFavorite: false, originalIndex: 24 },
      { id: 26, name: 'Sacramento Kings', imageUrl: kings, isFavorite: false, originalIndex: 25 },
      { id: 27, name: 'San Antonio Spurs', imageUrl: spurs, isFavorite: false, originalIndex: 26 },
      { id: 28, name: 'Toronto Raptors', imageUrl: raptors, isFavorite: false, originalIndex: 27 },
      { id: 29, name: 'Utah Jazz', imageUrl: jazz, isFavorite: false, originalIndex: 28 },
      { id: 30, name: 'Washington Wizards', imageUrl: wizards, isFavorite: false, originalIndex: 29 },
    ];
    setTeams(TeamsList);
  }, []);

  // Toggle favorite status and re-sort the teams
  const toggleFavorite = (id) => {
    setTeams(prevTeams => {
      const updatedTeams = prevTeams.map(team =>
        team.id === id ? { ...team, isFavorite: !team.isFavorite } : team
      );

      // Sort teams: favorited first, then by original index
      return updatedTeams.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) {
          return a.originalIndex - b.originalIndex;
        }
        return b.isFavorite - a.isFavorite;
      });
    });
  };

  const handleTeamClick = (teamName) => {
    navigate(`/team/${teamName}`); // Use teamName in the URL
  };

  return (
    <div className="team-highlights-container">
      {teams.map((team) => (
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
            {team.isFavorite ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeamHighlights;
