import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerHighlights.css';

const PlayerHighlights = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [videos, setVideos] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(''); // Store next page token
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); // Assuming you store the token here

    // Fetch players from the API
    const fetchPlayers = async (cursor = null, accumulatedPlayers = []) => {
        try {
            const response = await axios.get('https://api.balldontlie.io/v1/players', {
                headers: {
                    'Authorization': '408b7fc5-a3f6-45dd-8513-1fd506e18792', // Replace with your actual key or remove if unnecessary
                },
                params: {
                    per_page: 25,
                    cursor: cursor,
                },
            });

            const playerData = response.data.data;
            const allPlayers = accumulatedPlayers.concat(playerData);

            console.log('Fetched players:', allPlayers); // Log players

            if (allPlayers.length >= 300) {
                setPlayers(allPlayers.slice(0, 300));
            } else if (response.data.meta.next_cursor) {
                await fetchPlayers(response.data.meta.next_cursor, allPlayers);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    // Fetch player's highlights with pagination support
    const fetchPlayerHighlights = async (playerName, pageToken = '') => {
        setLoading(true);
        console.log('Fetching highlights for:', playerName); // Log player name
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${playerName} highlights`,
                    key: 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc', // Replace with your actual YouTube API key
                    maxResults: 5,
                    pageToken: pageToken, // Use pageToken for pagination
                },
            });

            const videoData = response.data.items.map((item) => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
            }));

            console.log('Fetched videos:', videoData); // Log video data
            setVideos((prevVideos) => [...prevVideos, ...videoData]); // Append new videos
            setNextPageToken(response.data.nextPageToken || ''); // Update the next page token
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the user's favorite players when the component mounts
    useEffect(() => {
        fetchPlayers();
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('https://nbareels-backend.onrender.com/api/favorites/players', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Fetched favorite players:', response.data); // Log favorite players from backend
                setFavorites(new Set(response.data)); // Assuming response data contains player IDs
            } catch (error) {
                console.error('Error fetching favorite players:', error);
            }
        };
        fetchFavorites();
    }, [token]);

    // Handle selecting a player
    const handleSelectChange = (event) => {
        const playerId = event.target.value;
        setSelectedPlayer(playerId);
        console.log('Selected player ID:', playerId); // Log selected player ID
        const selected = players.find(player => player.id === parseInt(playerId));
        if (selected) {
            console.log('Selected player:', selected); // Log selected player info
            setVideos([]); // Clear previous videos
            fetchPlayerHighlights(`${selected.first_name} ${selected.last_name}`);
        }
    };

    const handleFavoriteClick = async () => {
        if (selectedPlayer) {
            const playerId = parseInt(selectedPlayer); // Convert selectedPlayer to an integer
            const newFavorites = new Set(favorites);

            if (newFavorites.has(playerId)) {
                // If the player is already a favorite, remove them
                newFavorites.delete(playerId);
                try {
                    console.log('Removing player from favorites:', playerId); // Log player ID being removed
                    await axios.delete(`https://nbareels-backend.onrender.com/api/favorites/players/${playerId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    console.error('Error removing favorite:', error);
                }
            } else {
                // If the player is not a favorite, add them
                newFavorites.add(playerId);
                try {
                    console.log('Adding player to favorites:', playerId); // Log player ID being added
                    await axios.post('https://nbareels-backend.onrender.com/api/favorites/players', 
                    { playerId }, 
                    { headers: { Authorization: `Bearer ${token}` } });
                } catch (error) {
                    console.error('Error saving favorite:', error);
                }
            }
            setFavorites(newFavorites);
            console.log('Updated favorites:', newFavorites); // Log updated favorites
        }
    };

    // Load more videos when clicking the button
    const handleLoadMore = () => {
        const selected = players.find(player => player.id === parseInt(selectedPlayer));
        if (selected && nextPageToken) {
            fetchPlayerHighlights(`${selected.first_name} ${selected.last_name}`, nextPageToken);
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

                {/* Add favorite button with correct star icon */}
                <button 
                    onClick={handleFavoriteClick}
                    disabled={!selectedPlayer}
                    className="favorite-button"
                >
                    {favorites.has(parseInt(selectedPlayer)) ? (
                        <span role="img" aria-label="filled-star" style={{ color: 'gold', fontSize: '2rem' }}>★</span>
                    ) : (
                        <span role="img" aria-label="unfilled-star" style={{ color: 'gold', fontSize: '2rem' }}>☆</span>
                    )}
                </button>
            </div>

            {/* List of favorite players */}
            <h3>Favorites:</h3>
            <ul>
                {players.filter(player => favorites.has(player.id)).map(player => (
                    <li key={player.id}>
                        {player.first_name} {player.last_name}
                        <span>{favorites.has(player.id) ? '★' : '☆'}</span>
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

            {/* Load More Button */}
            {videos.length > 0 && (
                <button onClick={handleLoadMore} className="load-more-button">
                    Load More Videos
                </button>
            )}
        </div>
    );
};

export default PlayerHighlights;
