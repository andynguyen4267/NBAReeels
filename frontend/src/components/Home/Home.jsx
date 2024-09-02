import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const YOUTUBE_API_KEY = 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc'; // Replace with your actual YouTube API key
const CHANNEL_ID = 'UCWJ2lWNubArHWmf3FIHbfcQ'; // NBA's official YouTube channel ID

const Home = () => {
  const [highlights, setHighlights] = useState([]);
  const [filteredHighlights, setFilteredHighlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHighlights();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, highlights]);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: CHANNEL_ID,
          part: 'snippet',
          order: 'viewCount',
          maxResults: 50,
        },
      });

      const videoIds = response.data.items.map((item) => item.id.videoId).join(',');

      const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds,
          part: 'contentDetails,snippet,statistics',
        },
      });

      const videoDetails = videoDetailsResponse.data.items;

      const videoData = videoDetails
        .filter((video) => {
          const duration = video.contentDetails.duration;
          const durationSeconds = parseDuration(duration);
          return durationSeconds > 60; // Exclude Shorts
        })
        .map((video) => ({
          id: video.id,
          title: video.snippet.title,
          thumbnailUrl: video.snippet.thumbnails.high.url,
          views: video.statistics.viewCount || 'N/A',
          datePosted: video.snippet.publishedAt,
        }));

      setHighlights(videoData);
      setFilteredHighlights(videoData);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  const parseDuration = (duration) => {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = (parseInt(match[1]) || 0);
    let minutes = (parseInt(match[2]) || 0);
    let seconds = (parseInt(match[3]) || 0);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSearch = () => {
    const filtered = highlights.filter((highlight) =>
      highlight.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHighlights(filtered);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-container">
      <div className="home-search">
        <input
          type="text"
          className="search-bar"
          placeholder="Search Highlights..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="home-categories">
        <button className="category-button">Dunks</button>
        <button className="category-button">3-pointers</button>
        <button className="category-button">Clutch Shots</button>
        <button className="category-button">Assists</button>
        <button className="category-button">Handles</button>
      </div>
      <div className="home-highlights">
        {filteredHighlights.map((highlight) => (
          <div key={highlight.id} className="highlight-item">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${highlight.id}`}
              title={highlight.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="highlight-info">
              <h3>{highlight.title}</h3>
              <p>{highlight.views} views</p>
              <p>{new Date(highlight.datePosted).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
