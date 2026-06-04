import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../utils/animeName';
import './RelatedAnimeSidebar.css';

export const RelatedAnimeSidebar = ({ relatedAnimes }: { relatedAnimes: any[] }) => {
  if (!relatedAnimes || relatedAnimes.length === 0) return null;

  return (
    <div className="related-sidebar glass">
      <h3>Related Anime</h3>
      <div className="related-list">
        {relatedAnimes.slice(0, 6).map((anime: any) => {
          const displayName = getDisplayName(anime);
          return (
            <Link to={`/anime/${anime.id}`} key={anime.id} className="related-item">
              <img 
                src={anime.poster} 
                alt={displayName} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/Icon.png';
                }}
              />
              <div className="related-info">
                <div className="related-title">{displayName}</div>
                <div className="related-meta">{anime.type || 'TV'} • {anime.episodes?.sub || anime.episodes?.dub || '?'} Eps</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
