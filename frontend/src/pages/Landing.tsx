import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SearchSuggestions } from '../components/SearchSuggestions';
import './Landing.css';

interface LandingProps {
  onVisitHome: () => void;
}

export const Landing = ({ onVisitHome }: LandingProps) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onVisitHome();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setFocused(false);
    onVisitHome();
    navigate(`/search?q=${encodeURIComponent(name.trim())}`);
  };

  const handlePopularClick = (term: string) => {
    onVisitHome();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const popularSearches = [
    "Solo Leveling Season 2: Arise from the Shadow",
    "One Piece",
    "Sakamoto Days",
    "Solo Leveling",
    "Naruto: Shippuden",
    "Blue Lock Season 2",
    "Shangri-La Frontier Season 2",
    "Dandadan",
    "Bleach",
    "Possibly the Greatest Alchemist of All Time"
  ];

  return (
    <div className="landing-layout">
      <div className="landing-overlay"></div>
      
      <div className="landing-card glass">
        {/* Left Column: Search & Logo */}
        <div className="landing-left">
          <div className="landing-logo-container">
            <img src="/images/website.png" alt="YOHO ANIME" className="landing-logo" />
          </div>
          
          <form onSubmit={handleSearch} className="landing-search-form">
            <div className="landing-search-wrapper">
              <Search className="landing-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search anime titles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="landing-search-input"
              />
              <SearchSuggestions 
                query={query}
                visible={focused}
                onSelect={handleSelect}
              />
            </div>
          </form>
          
          <div className="landing-popular">
            <span className="landing-popular-label">Popular searches: </span>
            <div className="landing-popular-list">
              {popularSearches.map((term, index) => (
                <span key={term}>
                  <button 
                    type="button" 
                    className="popular-link-btn" 
                    onClick={() => handlePopularClick(term)}
                  >
                    {term}
                  </button>
                  {index < popularSearches.length - 1 && <span className="comma-separator">, </span>}
                </span>
              ))}
            </div>
          </div>
          
          <button onClick={onVisitHome} className="visit-home-btn">
            Visit Home <span className="arrow-icon">→</span>
          </button>
        </div>

        {/* Right Column: Branded SEO / Info Section */}
        <div className="landing-right">
          <h1 className="landing-title">YOHO ANIME - Stream Anime Online for FREE</h1>
          <p className="landing-desc">
            YOHO ANIME is a free anime streaming destination where fans can watch high quality anime series and movies with English subtitles or dubbed audio. With a constantly growing collection, discovering your favorite anime takes just a moment.
          </p>

          <h2 className="landing-section-title">Is YOHO ANIME secure to use?</h2>
          <p className="landing-desc">
            Absolutely. YOHO ANIME was built with user experience and safety in mind. We actively monitor the platform and encourage visitors to report anything unusual so we can take quick action.
          </p>

          <h2 className="landing-section-title">Why choose YOHO ANIME for watching anime online?</h2>
          <ul className="landing-features">
            <li>
              <strong>Massive catalog:</strong> Our library covers a wide range of anime genres, from classics to the latest releases.
            </li>
            <li>
              <strong>Smooth streaming:</strong> Multiple optimized servers are available, allowing you to pick the one that performs best for your location.
            </li>
            <li>
              <strong>Video quality options:</strong> Episodes are available in high resolution, with adjustable quality levels so viewers with slower connections can still enjoy uninterrupted playback.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
