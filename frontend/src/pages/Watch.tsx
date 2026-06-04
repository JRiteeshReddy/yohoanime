import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getEpisodeSource, getEpisodes, getAnimeDetails } from '../api';
import { EpisodeSidebar } from '../components/EpisodeSidebar';
import { RelatedAnimeSidebar } from '../components/RelatedAnimeSidebar';
import { Loader, ErrorScreen } from '../components/PageState';
import { Footer } from '../components/Footer';
import './Watch.css';

export const Watch = () => {
  const { id, ep } = useParams<{ id: string; ep: string }>();
  const navigate = useNavigate();
  const [source, setSource] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    if (id && ep) {
      setLoading(true);
      setError(null);
      Promise.all([
        getEpisodeSource(id, ep).catch(err => { console.error(err); return { data: null }; }),
        getEpisodes(id).catch(err => { console.error(err); return { data: { episodes: [] } }; }),
        getAnimeDetails(id).catch(err => { console.error(err); return { data: null }; })
      ]).then(([sourceRes, epsRes, detailsRes]) => {
        const srcData = sourceRes?.data;
        const epsData = epsRes?.data?.episodes || epsRes?.data || [];
        const detailsData = detailsRes?.data;

        if (!srcData && epsData.length === 0) {
          setError("Failed to load streaming data. Please try again.");
        } else {
          setSource(srcData);
          setEpisodes(epsData);
          setAnimeDetails(detailsData);
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError("An unexpected error occurred while fetching details.");
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [id, ep]);

  if (loading) return <Loader />;
  if (error) return <ErrorScreen message={error} onRetry={loadData} />;

  const episodeData = source?.episode || source;
  let videoUrl = null;
  let iframeUrl = episodeData?.iframe;

  if (Array.isArray(episodeData?.sources)) {
    videoUrl = episodeData.sources.find((s: any) => s.url?.includes('.m3u8'))?.url || episodeData.sources[0]?.url;
  } else if (episodeData?.sources) {
    iframeUrl = episodeData.sources.sub || episodeData.sources.dub;
  }

  const related = animeDetails?.related || animeDetails?.recommended || [];

  // Calculate previous and next episodes
  const currentEpIndex = episodes.findIndex((e: any) => String(e.number || e.episodeId) === ep);
  const prevEp = currentEpIndex > 0 ? episodes[currentEpIndex - 1] : null;
  const nextEp = currentEpIndex >= 0 && currentEpIndex < episodes.length - 1 ? episodes[currentEpIndex + 1] : null;
  
  const prevEpNum = prevEp ? (prevEp.number || prevEp.episodeId) : null;
  const nextEpNum = nextEp ? (nextEp.number || nextEp.episodeId) : null;

  const handlePrev = () => { if (prevEpNum) navigate(`/watch/${id}/${prevEpNum}`); };
  const handleNext = () => { if (nextEpNum) navigate(`/watch/${id}/${nextEpNum}`); };

  const Player = ReactPlayer as any;

  return (
    <>
      <div className="watch-page-layout">
        <aside className="watch-sidebar-left">
          <EpisodeSidebar animeId={id!} episodes={episodes} currentEp={ep!} />
        </aside>
        
        <main className="watch-main">
          <div className="player-container glass">
            {videoUrl ? (
              <Player url={videoUrl} controls width="100%" height="100%" playing />
            ) : iframeUrl ? (
              <iframe src={iframeUrl} width="100%" height="100%" allowFullScreen frameBorder="0" sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
            ) : (
              <div className="error">No playable source found.</div>
            )}
          </div>

          <div className="watch-controls glass">
            <button 
              className="control-btn" 
              onClick={handlePrev} 
              disabled={!prevEpNum}
            >
              ← Previous Episode
            </button>
            <button 
              className="control-btn" 
              onClick={handleNext} 
              disabled={!nextEpNum}
            >
              Next Episode →
            </button>
          </div>

          <div className="watch-info glass">
            <h2 style={{color: 'var(--primary-color)'}}>{animeDetails?.anime?.name || id}</h2>
            <p>You are watching <strong>Episode {ep}</strong></p>
            {animeDetails?.anime?.description && (
              <div className="watch-synopsis" style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {animeDetails.anime.description}
              </div>
            )}
          </div>
        </main>

        {related && related.length > 0 && (
          <aside className="watch-sidebar-right">
            <RelatedAnimeSidebar relatedAnimes={related} />
          </aside>
        )}
      </div>
      <Footer />
    </>
  );
};
