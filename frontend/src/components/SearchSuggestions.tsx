import React, { useState, useEffect, useRef } from 'react';
import { searchAnime } from '../api';
import { englishNameFromSlug, getDisplayName, getSearchRelevanceScore } from '../utils/animeName';
import popularAnimes from '../popularAnimes.json';
import './SearchSuggestions.css';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (name: string) => void;
  visible: boolean;
}

// Advanced Levenshtein distance & substring matching similarity
function getSimilarity(query: string, name: string): number {
  const normQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (!normQuery) return 0;
  if (normQuery === normName) return 1.0;
  
  // 1. Check if name starts with query
  if (normName.startsWith(normQuery)) {
    return 0.95 + (normQuery.length / normName.length) * 0.04;
  }
  
  // 2. Check if query starts any word in the name (e.g. "l" matches "leveling" in "Solo Leveling")
  const words = name.toLowerCase().split(/[\s-_]+/);
  const wordMatch = words.some(word => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    return cleanWord.startsWith(normQuery);
  });
  if (wordMatch) {
    return 0.85 + (normQuery.length / normName.length) * 0.09;
  }
  
  // 3. Substring match
  if (normName.includes(normQuery)) {
    return 0.70 + (normQuery.length / normName.length) * 0.14;
  }
  
  // 4. Fuzzy Levenshtein match (only do this for query lengths > 2 to avoid single letter matching everything)
  if (normQuery.length > 2) {
    const lenQ = normQuery.length;
    const lenN = normName.length;
    const d: number[][] = Array(lenN + 1).fill(null).map(() => Array(lenQ + 1).fill(0));
    for (let i = 0; i <= lenQ; i++) d[0][i] = i;
    for (let j = 0; j <= lenN; j++) d[j][0] = j;
    
    for (let j = 1; j <= lenN; j++) {
      for (let i = 1; i <= lenQ; i++) {
        const cost = normQuery[i - 1] === normName[j - 1] ? 0 : 1;
        d[j][i] = Math.min(
          d[j][i - 1] + 1,
          d[j - 1][i] + 1,
          d[j - 1][i - 1] + cost
        );
      }
    }
    const distance = d[lenN][lenQ];
    const maxLen = Math.max(lenQ, lenN);
    return 1.0 - distance / maxLen;
  }
  
  return 0;
}

const getFuzzyMatches = (query: string): any[] => {
  if (!query) return [];
  return (popularAnimes as any[])
    .map((anime: any) => {
      // Match against both the stored name and the slug-derived English name
      const engName = anime.id ? englishNameFromSlug(anime.id) : null;
      const sim1 = getSimilarity(query, anime.name);
      const sim2 = engName ? getSimilarity(query, engName) : 0;
      return { ...anime, similarity: Math.max(sim1, sim2) };
    })
    .filter((item: any) => item.similarity > 0.45)
    .sort((a: any, b: any) => {
      const nameA = getDisplayName(a);
      const nameB = getDisplayName(b);
      const scoreA = getSearchRelevanceScore(nameA, query);
      const scoreB = getSearchRelevanceScore(nameB, query);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return b.similarity - a.similarity;
    })
    .slice(0, 8);
};

export const SearchSuggestions = ({ query, onSelect, visible }: SearchSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 1 || !visible) {
      setSuggestions([]);
      return;
    }

    // Instantly set fuzzy matches so the user gets immediate feedback
    const instantFuzzy = getFuzzyMatches(query.trim());
    setSuggestions(instantFuzzy);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Only query the API if query length is 2 or more characters (to keep 1 letter search fast)
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        setLoading(true);
        searchAnime(query.trim())
          .then((res) => {
            const apiAnimes = res.data?.animes || [];
            
            // Merge API and fuzzy matches
            const merged: any[] = [...apiAnimes];
            const seenNames = new Set(apiAnimes.map((a: any) => a.name.toLowerCase()));
            
            // Re-fetch fuzzy matches for the latest state of query
            const fuzzyAnimes = getFuzzyMatches(query.trim());
            for (const item of fuzzyAnimes) {
              if (!seenNames.has(item.name.toLowerCase())) {
                seenNames.add(item.name.toLowerCase());
                merged.push(item);
              }
            }
            
            // Sort by relevance score
            const sorted = [...merged].sort((a: any, b: any) => {
              const nameA = getDisplayName(a);
              const nameB = getDisplayName(b);
              const scoreA = getSearchRelevanceScore(nameA, query.trim());
              const scoreB = getSearchRelevanceScore(nameB, query.trim());
              return scoreB - scoreA;
            });
            
            setSuggestions(sorted.slice(0, 8));
            setLoading(false);
          })
          .catch(() => {
            // On API error, keep showing the fuzzy matches
            setLoading(false);
          });
      }, 300);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, visible]);

  if (!visible || query.trim().length < 1) return null;
  if (loading && suggestions.length === 0) {
    return (
      <div className="suggestions-dropdown">
        <div className="suggestion-loading">Searching...</div>
      </div>
    );
  }
  if (suggestions.length === 0) return null;

  return (
    <div className="suggestions-dropdown">
      {suggestions.map((anime: any) => {
        const displayName = getDisplayName(anime);
        return (
        <button
          key={anime.id || anime.name}
          className="suggestion-item"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(displayName);
          }}
        >
          <img
            src={anime.poster}
            alt={displayName}
            className="suggestion-poster"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/Icon.png';
            }}
          />
          <div className="suggestion-info">
            <span className="suggestion-name">{displayName}</span>
            {anime.type && <span className="suggestion-type">{anime.type}</span>}
          </div>
        </button>
        );
      })}
    </div>
  );
};
