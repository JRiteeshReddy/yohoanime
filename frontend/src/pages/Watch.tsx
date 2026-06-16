import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getEpisodeSource, getEpisodes, getAnimeDetails } from '../api';
import { EpisodeSidebar } from '../components/EpisodeSidebar';
import { RelatedAnimeSidebar } from '../components/RelatedAnimeSidebar';
import { Loader, ErrorScreen } from '../components/PageState';
import { Footer } from '../components/Footer';
import { getDisplayName } from '../utils/animeName';
import './Watch.css';

export const Watch = () => {
  const { id, ep } = useParams<{ id: string; ep: string }>();
  const navigate = useNavigate();
  const [source, setSource] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'dub' ? 'dub' : 'sub';
  
  const [activeSourceType, setActiveSourceType] = useState<string>(initialType);
  const [activeServer, setActiveServer] = useState<string>('Vidstream-1');

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

          // Initialize default stream
          const epData = srcData?.episode || srcData;
          if (epData && epData.sources) {
            if (Array.isArray(epData.sources)) {
              const url = epData.sources.find((s: any) => s.url?.includes('.m3u8'))?.url || epData.sources[0]?.url;
              setActiveUrl(url);
            } else {
              const sources = epData.sources;
              
              if (initialType === 'dub' && (sources.dub || sources.aniDub)) {
                setActiveSourceType('dub');
                if (sources.dub) {
                  setActiveServer('Vidstream-1');
                  setActiveUrl(sources.dub);
                } else {
                  setActiveServer('Vidstream-2');
                  setActiveUrl(sources.aniDub);
                }
              } else if (sources.sub || sources.aniSub) {
                setActiveSourceType('sub');
                if (sources.sub) {
                  setActiveServer('Vidstream-1');
                  setActiveUrl(sources.sub);
                } else {
                  setActiveServer('Vidstream-2');
                  setActiveUrl(sources.aniSub);
                }
              } else if (sources.dub || sources.aniDub) {
                setActiveSourceType('dub');
                if (sources.dub) {
                  setActiveServer('Vidstream-1');
                  setActiveUrl(sources.dub);
                } else {
                  setActiveServer('Vidstream-2');
                  setActiveUrl(sources.aniDub);
                }
              }
            }
          }
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
  let iframeUrl = null;

  if (activeUrl) {
    const isM3u8 = activeUrl.includes('.m3u8') || activeUrl.includes('.mp4');
    if (isM3u8) {
      videoUrl = activeUrl;
    } else {
      iframeUrl = activeUrl;
    }
  } else if (episodeData?.iframe) {
    iframeUrl = episodeData.iframe;
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
              <Player url={videoUrl} controls width="100%" height="100%" playing muted={false} volume={1} />
            ) : iframeUrl ? (
              <iframe 
                src={iframeUrl} 
                width="100%" 
                height="100%" 
                allowFullScreen 
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-top-navigation-by-user-activation"
              ></iframe>
            ) : (
              <div className="error">No playable source found.</div>
            )}
          </div>

          {/* Server Selector Card */}
          {episodeData?.sources && !Array.isArray(episodeData.sources) && (
            <div className="server-selector-card glass">
              <div className="server-selector-info">
                <h3>You're watching <span style={{ color: 'var(--primary-color)' }}>Episode {ep}</span></h3>
                <p>If current servers doesn't work, please try other servers beside.</p>
              </div>
              <div className="server-rows">
                {(episodeData.sources.sub || episodeData.sources.aniSub) && (
                  <div className="server-row">
                    <div className="server-label">
                      <span className="cc-badge">CC</span> SUB
                    </div>
                    <div className="server-buttons">
                      {episodeData.sources.sub && (
                        <button
                          className={`server-btn ${activeSourceType === 'sub' && activeServer === 'Vidstream-1' ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSourceType('sub');
                            setActiveServer('Vidstream-1');
                            setActiveUrl(episodeData.sources.sub);
                          }}
                        >
                          <span className="play-icon">▶</span> Vidstream-1
                        </button>
                      )}
                      {episodeData.sources.aniSub && (
                        <button
                          className={`server-btn ${activeSourceType === 'sub' && activeServer === 'Vidstream-2' ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSourceType('sub');
                            setActiveServer('Vidstream-2');
                            setActiveUrl(episodeData.sources.aniSub);
                          }}
                        >
                          <span className="play-icon">▶</span> Vidstream-2
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {(episodeData.sources.dub || episodeData.sources.aniDub) && (
                  <div className="server-row">
                    <div className="server-label">
                      <span className="mic-badge">🎤</span> DUB
                    </div>
                    <div className="server-buttons">
                      {episodeData.sources.dub && (
                        <button
                          className={`server-btn ${activeSourceType === 'dub' && activeServer === 'Vidstream-1' ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSourceType('dub');
                            setActiveServer('Vidstream-1');
                            setActiveUrl(episodeData.sources.dub);
                          }}
                        >
                          <span className="play-icon">▶</span> Vidstream-1
                        </button>
                      )}
                      {episodeData.sources.aniDub && (
                        <button
                          className={`server-btn ${activeSourceType === 'dub' && activeServer === 'Vidstream-2' ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSourceType('dub');
                            setActiveServer('Vidstream-2');
                            setActiveUrl(episodeData.sources.aniDub);
                          }}
                        >
                          <span className="play-icon">▶</span> Vidstream-2
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
            <h2 style={{color: 'var(--primary-color)'}}>
              {animeDetails?.anime ? getDisplayName({
                id: animeDetails.anime.id || id,
                name: animeDetails.anime.name,
                jname: animeDetails.anime.jname || animeDetails.anime.japanese
              }) : (id ? getDisplayName({ id }) : '')}
            </h2>
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
