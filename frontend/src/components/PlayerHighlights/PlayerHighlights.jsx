import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerHighlights.css';

const PlayerHighlights = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPlayers = async (cursor = null, accumulatedPlayers = []) => {
        try {
            const response = await axios.get('https://api.balldontlie.io/v1/players', {
                headers: {
                    'Authorization': '408b7fc5-a3f6-45dd-8513-1fd506e18792',
                },
                params: {
                    per_page: 25,
                    cursor: cursor,
                },
            });

            const playerData = response.data.data;
            const allPlayers = accumulatedPlayers.concat(playerData);

            if (allPlayers.length >= 200) {
                setPlayers(allPlayers.slice(0, 200));
            } else if (response.data.meta.next_cursor) {
                await fetchPlayers(response.data.meta.next_cursor, allPlayers);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const fetchPlayerHighlights = async (playerName) => {
        setLoading(true);
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${playerName} highlights`,
                    key: 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc', // Replace with your actual YouTube API key
                    maxResults: 5,
                },
            });

            const videoData = response.data.items.map((item) => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
            }));

            setVideos(videoData);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleSelectChange = (event) => {
        const playerId = event.target.value;
        setSelectedPlayer(playerId);
        const selected = players.find(player => player.id === parseInt(playerId));
        fetchPlayerHighlights(`${selected.first_name} ${selected.last_name}`);
    };

    const handleFavoriteClick = () => {
        if (selectedPlayer) {
            setFavorites((prevFavorites) => {
                const newFavorites = new Set(prevFavorites);
                if (newFavorites.has(selectedPlayer)) {
                    newFavorites.delete(selectedPlayer);
                } else {
                    newFavorites.add(selectedPlayer);
                }
                return newFavorites;
            });
        }
    };

    return (
        <div className="player-highlights-container">
            <div className="select-favorite-container">
                <select 
                    value={selectedPlayer}
                    onChange={handleSelectChange}
                    className="player-select"
                >
                    <option value="">Select a player</option>
                    {players.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.first_name} {player.last_name}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleFavoriteClick}
                    disabled={!selectedPlayer}
                    className={`favorite-button ${favorites.has(selectedPlayer) ? 'favorited' : ''}`}
                >
                    {favorites.has(selectedPlayer) ? '★' : '☆'}
                </button>
            </div>

            <h3>Favorites:</h3>
            <ul>
                {players.filter(player => favorites.has(player.id)).map(player => (
                    <li key={player.id}>
                        {player.first_name} {player.last_name}
                    </li>
                ))}
            </ul>
            {loading ? (
                <p>Loading highlights...</p>
            ) : (
                <div className="videos-container">
                    {videos.map((video) => (
                        <div key={video.videoId} className="video-item">
                            <h4>{video.title}</h4>
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${video.videoId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={video.title}
                            ></iframe>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayerHighlights;
