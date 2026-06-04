import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getDisplayName } from '../utils/animeName';
import './HeroSlider.css';

export const HeroSlider = ({ animes }: { animes: any[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animes.length]);

  if (!animes || animes.length === 0) return null;

  return (
    <div className="hero-slider">
      <div 
        className="hero-slider-track" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {animes.map((anime, index) => {
          const displayName = getDisplayName(anime);
          return (
            <div className="hero-slide" key={anime.id || index}>
              <div className="hero-bg">
                <img 
                  src={anime.poster} 
                  alt={displayName} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/Icon.png';
                  }}
                />
                <div className="hero-overlay"></div>
              </div>
              <div className="hero-content">
                <h1 className="hero-title">{displayName}</h1>
                <div className="hero-meta">
                  <span className="badge pg">{anime.rating || 'PG-13'}</span>
                  <span className="badge quality">HD</span>
                  <span className="badge eps">CC: {anime.episodes?.sub || anime.episodes?.dub || '?'}</span>
                  <span className="hero-date">{anime.otherInfo?.[1] || anime.premiered || ''}</span>
                </div>
                <p className="hero-desc">{anime.description}</p>
                <Link to={`/watch/${anime.id}/1`} className="button play-btn">
                  <Play size={18} fill="currentColor" /> PLAY NOW
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="hero-pagination">
        {animes.map((_, i) => (
          <button 
            key={i} 
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};
