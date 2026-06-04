import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  const navigate = useNavigate();
  
  const alphabet = [
    "All", "#", "0-9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];

  const handleLetterClick = (letter: string) => {
    if (letter === "All") {
      navigate('/');
    } else {
      navigate(`/search?q=${encodeURIComponent(letter)}`);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-overlay"></div>
      
      <div className="footer-container">
        {/* A-Z List Section */}
        <div className="az-list-section">
          <div className="az-header">
            <h3 className="az-title">A-Z List</h3>
            <span className="az-subtitle">Searching anime order by alphabet name A to Z.</span>
          </div>
          <div className="az-letters">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className="az-letter-btn"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Branding & Social Connect Row */}
        <div className="footer-brand-row">
          <div className="footer-logo-wrapper">
            <Link to="/">
              <img src="/images/website.png" alt="YOHO ANIME" className="footer-logo" />
            </Link>
            
            {/* Join now Pill */}
            <a 
              href="https://www.instagram.com/yohoanime?igsh=cHFmYjQ1N25ra2Zj" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="join-pill"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <span className="join-text" style={{ paddingRight: '12px' }}>Follow us</span>
            </a>
          </div>

          <div className="footer-links">
            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Help & support center details coming soon!"); }} className="footer-link">Help</a>
            <a href="#request" onClick={(e) => { e.preventDefault(); alert("Request an anime feature is under construction!"); }} className="footer-link">Request Anime</a>
            <a href="https://www.instagram.com/yohoanime?igsh=cHFmYjQ1N25ra2Zj" target="_blank" rel="noopener noreferrer" className="footer-link">Contact</a>
            <a href="#friends" onClick={(e) => { e.preventDefault(); alert("Our partner networks will be listed here."); }} className="footer-link">Friends</a>
          </div>
        </div>

        {/* Copyright & Disclaimer Section */}
        <div className="footer-meta-section">
          <p className="disclaimer-text">
            This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
};
