import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../utils/animeName';
import './TopTenSidebar.css';

export const TopTenSidebar = ({ top10Animes }: { top10Animes: any }) => {
  const [tab, setTab] = useState<'today' | 'week' | 'month'>('today');

  if (!top10Animes) return null;

  const animes = top10Animes[tab] || [];

  return (
    <div className="top-ten-sidebar glass">
      <div className="top-ten-header">
        <h2>Top anime</h2>
        <div className="top-ten-tabs">
          <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>Day</button>
          <button className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>Week</button>
          <button className={tab === 'month' ? 'active' : ''} onClick={() => setTab('month')}>Month</button>
        </div>
      </div>
      <div className="top-ten-list">
        {animes.map((anime: any, idx: number) => {
          const displayName = getDisplayName(anime);
          return (
            <Link to={`/watch/${anime.id}/1`} key={anime.id} className="top-ten-item hover-scale">
              <div className={`rank rank-${idx + 1}`}>{idx + 1}</div>
              <img 
                src={anime.poster} 
                alt={displayName} 
                className="top-ten-img" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/Icon.png';
                }}
              />
              <div className="top-ten-info">
                <div className="top-ten-title">{displayName}</div>
                <div className="top-ten-meta">
                  {anime.episodes?.sub && <span className="badge sub">CC: {anime.episodes.sub}</span>}
                  {anime.episodes?.dub && <span className="badge dub">Mic: {anime.episodes.dub}</span>}
                  <span className="dot-sep">•</span>
                  <span>TV</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
