import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc'; // Replace with your YouTube API key
const CHANNEL_ID = 'UCWJ2lWNubArHWmf3FIHbfcQ'; // NBA's official YouTube channel ID

const TeamHighlightPage = () => {
  const { teamName } = useParams(); // Extract team name from URL parameters
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch team highlights when the component mounts or team name changes
  useEffect(() => {
    fetchTeamHighlights();
  }, [teamName]);

  // Fetch videos when the search term changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, videos]);

  // Function to fetch team highlights
  const fetchTeamHighlights = async () => {
    try {
      setIsLoadingMore(true);

      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: CHANNEL_ID,
          q: teamName, // Use the team name to filter the videos
          part: 'snippet',
          maxResults: 10,
          order: 'viewCount',
          pageToken: nextPageToken,
        },
      });

      const newVideos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        datePosted: item.snippet.publishedAt,
      }));

      // Remove duplicate videos
      const uniqueVideos = [...videos, ...newVideos].reduce((acc, video) => {
        const isDuplicate = acc.find((v) => v.id === video.id);
        if (!isDuplicate) {
          acc.push(video);
        }
        return acc;
      }, []);

      setVideos(uniqueVideos);
      setFilteredVideos(uniqueVideos);
      setNextPageToken(response.data.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching team highlights:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Search function to filter videos based on search term
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle loading more videos when "Load More" is clicked
  const loadMoreVideos = () => {
    fetchTeamHighlights();
  };

  return (
    <div className="team-highlight-container">
      <h1>{teamName} Highlights</h1> {/* Display team name */}

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search team highlights..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="team-videos">
        {filteredVideos.map((video, index) => (
          <div key={`${video.id}-${index}`} className="video-item">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>Posted on {new Date(video.datePosted).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {nextPageToken && (
        <button className="load-more-button" onClick={loadMoreVideos}>
          {isLoadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default TeamHighlightPage;
