import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchSuggestions } from './SearchSuggestions';
import './Navbar.css';

export const Navbar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setFocused(false);
    navigate(`/search?q=${encodeURIComponent(name.trim())}`);
  };

  return (
    <nav className="glass-nav navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <picture>
            <source media="(max-width: 768px)" srcSet="/images/mobile%20website.png" />
            <img src="/images/website.png" alt="YOHO ANIME" className="navbar-logo" />
          </picture>
        </Link>
        <div className="search-bar glass">
          <SearchIcon size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search anime... (Press Enter)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <SearchSuggestions 
            query={query}
            visible={focused}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </nav>
  );
};
