import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimeCard } from '../components/AnimeCard';
import { Footer } from '../components/Footer';
import { searchAnime } from '../api';
import { getDisplayName, getSearchRelevanceScore } from '../utils/animeName';
import './Search.css';

import { Loader, ErrorScreen } from '../components/PageState';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    if (query) {
      setLoading(true);
      setError(null);
      searchAnime(query)
        .then((res) => {
          const rawResults = res.data?.animes || [];
          // Sort results by relevance score
          const sorted = [...rawResults].sort((a: any, b: any) => {
            const nameA = getDisplayName(a);
            const nameB = getDisplayName(b);
            const scoreA = getSearchRelevanceScore(nameA, query);
            const scoreB = getSearchRelevanceScore(nameB, query);
            return scoreB - scoreA;
          });
          setResults(sorted);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load search results. Please check your network connection.");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [query]);

  return (
    <>
      <div className="search-page">
        <h2 className="search-title">
          Search Results for "{query}"
        </h2>
        {loading && <Loader />}
        {error && <ErrorScreen message={error} onRetry={loadData} />}
        {!loading && !error && results.length === 0 && (
          <p className="no-results">No anime found matching your query.</p>
        )}
        {!loading && !error && results.length > 0 && (
          <div className="anime-grid">
            {results.map((anime: any) => (
              <Link to={`/watch/${anime.id}/1`} key={anime.id}>
                <AnimeCard 
                  id={anime.id}
                  title={anime.name}
                  image={anime.poster}
                  episodes={anime.episodes}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
      {!loading && !error && <Footer />}
    </>
  );
};
