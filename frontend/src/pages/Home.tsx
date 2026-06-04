import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimeCard } from '../components/AnimeCard';
import { HeroSlider } from '../components/HeroSlider';
import { TopTenSidebar } from '../components/TopTenSidebar';
import { Footer } from '../components/Footer';
import { getHome } from '../api';
import './Home.css';

import { Loader, ErrorScreen } from '../components/PageState';

export const Home = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    getHome().then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError("Failed to load home page content. Please check if backend is running.");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;
  if (error || !data) return <ErrorScreen message={error || "Failed to load data."} onRetry={loadData} />;

  return (
    <>
      <div className="home-page">
        <HeroSlider animes={data.spotlightAnimes} />

        <div className="home-layout">
          <div className="home-main">
            <section className="anime-section">
              <h2>Latest Episode</h2>
              <div className="anime-grid">
                {data.latestEpisodeAnimes?.map((anime: any) => (
                  <Link to={`/watch/${anime.id}/1`} key={anime.id}>
                    <AnimeCard id={anime.id} title={anime.name} image={anime.poster} episodes={anime.episodes} type={anime.type} />
                  </Link>
                ))}
              </div>
            </section>

            <section className="anime-section">
              <h2>New Release</h2>
              <div className="anime-grid">
                {data.newReleases?.map((anime: any) => (
                  <Link to={`/watch/${anime.id}/1`} key={anime.id}>
                    <AnimeCard id={anime.id} title={anime.name} image={anime.poster} episodes={anime.episodes} type={anime.type} />
                  </Link>
                ))}
              </div>
            </section>

            <section className="anime-section">
              <h2>Top Upcoming</h2>
              <div className="anime-grid">
                {data.topUpcomingAnimes?.map((anime: any) => (
                  <Link to={`/watch/${anime.id}/1`} key={anime.id}>
                    <AnimeCard id={anime.id} title={anime.name} image={anime.poster} episodes={anime.episodes} type={anime.type} />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="home-sidebar">
            <TopTenSidebar top10Animes={data.top10Animes} />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};
