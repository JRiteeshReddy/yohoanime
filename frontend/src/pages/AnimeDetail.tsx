import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeDetails, getEpisodes } from '../api';
import { Footer } from '../components/Footer';
import { getDisplayName } from '../utils/animeName';
import './AnimeDetail.css';

import { Loader, ErrorScreen } from '../components/PageState';

export const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    if (id) {
      setLoading(true);
      setError(null);
      Promise.all([
        getAnimeDetails(id).catch(err => { console.error(err); return { data: null }; }),
        getEpisodes(id).catch(err => { console.error(err); return { data: { episodes: [] } }; })
      ])
        .then(([detailsRes, epsRes]) => {
          const animeData = detailsRes.data?.anime || detailsRes.data;
          const epsData = epsRes.data?.episodes || epsRes.data || [];
          
          if (!animeData) {
            setError("Anime details could not be found.");
          } else {
            setAnime(animeData);
            setEpisodes(epsData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load anime details.");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !anime) return <ErrorScreen message={error || "Anime not found."} onRetry={loadData} />;

  const displayName = getDisplayName({
    id: anime.id || id,
    name: anime.name || anime.info?.name,
    jname: anime.jname || anime.info?.jname || anime.info?.japanese || anime.japanese
  });

  return (
    <>
      <div className="anime-detail-page">
        <div className="anime-detail-header glass">
          <img 
            src={anime.poster || anime.info?.poster} 
            alt={displayName} 
            className="anime-detail-poster" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/Icon.png';
            }}
          />
          <div className="anime-detail-info">
            <h1>{displayName}</h1>
            <p className="anime-detail-desc">{anime.description || anime.info?.description}</p>
          </div>
        </div>
        <div className="anime-episodes glass">
          <h2>Episodes</h2>
          <div className="episodes-grid">
            {episodes.map((ep: any, index: number) => {
              const epNum = ep.number || ep.episodeId || index + 1;
              return (
                <Link 
                  to={`/watch/${id}/${epNum}`} 
                  key={epNum} 
                  className="episode-card hover-scale"
                >
                  <div className="ep-num">EP {epNum}</div>
                  <div className="ep-title">{ep.title || `Episode ${epNum}`}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
