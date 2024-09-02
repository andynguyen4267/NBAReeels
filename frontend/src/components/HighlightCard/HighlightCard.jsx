// src/components/HighlightCard/HighlightCard.jsx
import React from 'react';
import './HighlightCard.css';

const HighlightCard = ({ thumbnailUrl, title, category, views, datePosted }) => {
  return (
    <div className="highlight-card">
      <img src={thumbnailUrl} alt={title} className="highlight-thumbnail" />
      <div className="highlight-info">
        <h3 className="highlight-title">{title}</h3>
        <p className="highlight-category">{category}</p>
        <p className="highlight-views">{views} views</p>
        <p className="highlight-date">{datePosted}</p>
      </div>
    </div>
  );
};

export default HighlightCard;

