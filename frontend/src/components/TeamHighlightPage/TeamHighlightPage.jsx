import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyD42fpdjEEuxEutqerD7YhyBVr2-3DRMQc'; // Replace with your YouTube API key
const CHANNEL_ID = 'UCWJ2lWNubArHWmf3FIHbfcQ'; // NBA's official YouTube channel ID

const TeamHighlightPage = () => {
  const { teamName } = useParams(); // Get team name from URL params
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    fetchTeamHighlights();
  }, [teamName]);

  const fetchTeamHighlights = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: CHANNEL_ID,
          q: teamName, 
          part: 'snippet',
          order: 'viewCount',
          maxResults: 25,
        },
      });

      const videoIds = response.data.items.map(item => item.id.videoId);

      const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds.join(','),
          part: 'statistics',
        },
      });

      const videoDetails = videoDetailsResponse.data.items;

      const videoData = response.data.items.map((item, index) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        datePosted: item.snippet.publishedAt,
        viewCount: videoDetails[index]?.statistics.viewCount || 'N/A',
      }));

      setHighlights(videoData);
    } catch (error) {
      console.error('Error fetching team highlights:', error);
    }
  };

  return (
    <div className="team-highlight-page">
      <h2>Highlights for the {teamName}</h2>
      <div className="team-highlights">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="highlight-item">
            <h3>{highlight.title}</h3>
            <p>{new Date(highlight.datePosted).toLocaleDateString()}</p>
            <p>Views: {highlight.viewCount}</p>
            <div className="video-responsive">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${highlight.id}`}
                title={highlight.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamHighlightPage;
