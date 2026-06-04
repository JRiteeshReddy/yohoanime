import React from 'react';
import { Play } from 'lucide-react';
import { getDisplayName } from '../utils/animeName';

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  type?: string;
  episodes?: { sub?: number; dub?: number };
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ id, title, image, type, episodes }) => {
  const displayName = getDisplayName({ id, name: title });
  return (
    <div className="anime-card glass hover-scale">
      <div className="anime-card-image-wrapper">
        <img 
          src={image} 
          alt={displayName} 
          className="anime-card-image" 
          loading="lazy" 
          onError={(e) => {
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.src = '/images/Icon.png';
          }}
        />
        <div className="anime-card-overlay">
          <div className="play-btn-overlay">
            <div className="play-icon-circle">
              <Play size={24} fill="currentColor" stroke="none" />
            </div>
          </div>
          <div className="anime-card-info-top">
            {episodes && (
              <div className="anime-card-badges">
                {episodes.sub && <span className="badge sub">CC: {episodes.sub}</span>}
                {episodes.dub && <span className="badge dub">Mic: {episodes.dub}</span>}
              </div>
            )}
            {type && <span className="badge type">{type}</span>}
          </div>
        </div>
      </div>
      <div className="anime-card-content">
        <h3 className="anime-card-title">{displayName}</h3>
      </div>
    </div>
  );
};
