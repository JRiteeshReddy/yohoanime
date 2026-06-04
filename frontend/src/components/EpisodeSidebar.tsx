import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EpisodeSidebar.css';

export const EpisodeSidebar = ({ animeId, episodes, currentEp }: { animeId: string, episodes: any[], currentEp: string }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEpisodes = episodes.filter(ep => {
    const epNum = ep.number || ep.episodeId;
    return String(epNum).includes(searchTerm);
  });

  return (
    <div className="episode-sidebar glass">
      <div className="eps-header">
        <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', color: 'var(--text-main)' }}>Episodes List:</h3>
        <div className="eps-search">
          <input 
            type="text" 
            placeholder="Search ep..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="eps-list-container">
        {filteredEpisodes.map((ep: any, index: number) => {
          const epNum = ep.number || ep.episodeId || index + 1;
          const isActive = String(epNum) === currentEp;
          
          let title = ep.title || '';
          try {
            const txt = document.createElement("textarea");
            txt.innerHTML = title;
            title = txt.value;
          } catch(e) {}
          
          const isRedundant = title.toLowerCase().trim() === `episode ${epNum}` || title.toLowerCase().trim() === `ep ${epNum}`;
          const displayTitle = isRedundant ? '' : title;

          return (
            <Link 
              to={`/watch/${animeId}/${epNum}`} 
              key={epNum} 
              className={`ep-list-item ${isActive ? 'active' : ''}`}
            >
              <span className="ep-index">Ep {epNum}{displayTitle ? ':' : ''}</span>
              {displayTitle && <span className="ep-title">{displayTitle}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
