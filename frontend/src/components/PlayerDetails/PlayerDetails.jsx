// src/components/PlayerDetails/PlayerDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetails.css';
import lebron from './assets/lebron.jpeg';
import lebronDunk from './assets/lebron.jpeg'
import lebronThree from './assets/lebron.jpeg'

const PlayerDetails = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [highlights, setHighlights] = useState([]);

  // Mock data for a specific player's highlights
  useEffect(() => {
    const mockPlayer = {
      id: playerId,
      first_name: 'LeBron',
      last_name: 'James',
      imageUrl: lebron
    };

    const mockHighlights = [
      {
        id: 1,
        title: 'LeBron James Incredible Dunk',
        thumbnailUrl: lebronDunk,
        views: '1.5M',
        datePosted: '2 days ago',
      },
      {
        id: 2,
        title: 'LeBron James Clutch 3-pointer',
        thumbnailUrl: lebronThree,
        views: '1.2M',
        datePosted: '3 days ago',
      },
    ];

    setPlayer(mockPlayer);
    setHighlights(mockHighlights);
  }, [playerId]);

  if (!player) return <p>Loading...</p>;

  return (
    <div className="player-details-container">
      <div className="player-profile">
        <img src={player.imageUrl} alt={`${player.first_name} ${player.last_name}`} className="player-image" />
        <h2>{player.first_name} {player.last_name}</h2>
      </div>
      <div className="player-highlights">
        <h3>Highlights</h3>
        {highlights.length > 0 ? (
          highlights.map((highlight) => (
            <div key={highlight.id} className="highlight-card">
              <img src={highlight.thumbnailUrl} alt={highlight.title} className="highlight-thumbnail" />
              <div className="highlight-info">
                <h4>{highlight.title}</h4>
                <p>{highlight.views} views • {highlight.datePosted}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No highlights found</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails;
