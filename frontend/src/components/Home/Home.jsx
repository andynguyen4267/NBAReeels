import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const YOUTUBE_API_KEY = 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc'; // Replace with your actual YouTube API key
const CHANNEL_ID = 'UCWJ2lWNubArHWmf3FIHbfcQ'; // NBA's official YouTube channel ID

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [playlistId, setPlaylistId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch the upload playlist ID when the component mounts
  useEffect(() => {
    const getUploadPlaylistId = async () => {
      const uploadsId = await fetchUploadPlaylistId();
      if (uploadsId) {
        setPlaylistId(uploadsId);
        fetchVideosFromPlaylist(uploadsId);
      }
    };

    getUploadPlaylistId();
  }, []);

  // Fetch videos when the playlist ID or page token changes
  useEffect(() => {
    if (playlistId) {
      fetchVideosFromPlaylist(playlistId);
    }
  }, [playlistId, nextPageToken]);

  // Handle search term changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, videos]);

  // Function to fetch the upload playlist ID
  const fetchUploadPlaylistId = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'contentDetails',
          id: CHANNEL_ID,
          key: YOUTUBE_API_KEY,
        },
      });

      const uploadsPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
      return uploadsPlaylistId;
    } catch (error) {
      console.error('Error fetching upload playlist ID:', error);
      return null;
    }
  };

  // Function to fetch videos from the playlist
  const fetchVideosFromPlaylist = async (playlistId, pageToken = '') => {
    try {
      setIsLoadingMore(true);

      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          playlistId,
          key: YOUTUBE_API_KEY,
          maxResults: 10, // Adjust as needed
          pageToken, // For pagination
        },
      });

      const newVideos = response.data.items.map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        datePosted: item.snippet.publishedAt,
      }));

      // Remove duplicates by checking video IDs
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
      console.error('Error fetching videos:', error);
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
    if (playlistId && nextPageToken) {
      fetchVideosFromPlaylist(playlistId, nextPageToken);
    }
  };

  return (
    <div className="home-container">
      <h1>Latest Videos</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="home-videos">
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

export default Home;
