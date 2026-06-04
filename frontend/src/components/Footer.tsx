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
            <div className="join-pill">
              <span className="join-text">Join now</span>
              <a 
                href="https://reddit.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="join-icon-btn reddit-btn"
                aria-label="Join our Reddit community"
              >
                <svg className="social-svg" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <path d="M17.18 8.84a2.22 2.22 0 00-3.69-1.61 10.15 10.15 0 00-4.83-1.46L9.62 2.6l3.14.67a1.44 1.44 0 10.05.35l-3.32-.71-.88 4.14a10.22 10.22 0 00-4.87 1.47 2.22 2.22 0 00-3.7 1.62c0 .9.53 1.69 1.3 2.06A6.29 6.29 0 001.3 11c0 2.8 3.9 5.07 8.7 5.07s8.7-2.27 8.7-5.07a6.26 6.26 0 00-.06-1.12c.75-.38 1.25-1.15 1.25-2.04zm-12.75 3.3a1.14 1.14 0 111.14-1.14 1.14 1.14 0 01-1.14 1.14zm6.82 2.12a3.84 3.84 0 01-5 0 .32.32 0 11.45-.45 3.19 3.19 0 004.1 0 .32.32 0 01.45.45zm-.82-2.12a1.14 1.14 0 111.14-1.14 1.14 1.14 0 01-1.14 1.14z"/>
                </svg>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="join-icon-btn discord-btn"
                aria-label="Join our Discord channel"
              >
                <svg className="social-svg" viewBox="0 0 127.14 96.36" width="16" height="16" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,69.43,69.43,0,0,1-10.45-5c.87-.64,1.71-1.32,2.51-2a75.46,75.46,0,0,0,72.9,0c.8,$.71,1.64,1.39,2.51,2a69.43,69.43,0,0,1-10.45,5A77.7,77.7,0,0,0,95.14,96.36a105.73,105.73,0,0,0,31.06-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Help & support center details coming soon!"); }} className="footer-link">Help</a>
            <a href="#request" onClick={(e) => { e.preventDefault(); alert("Request an anime feature is under construction!"); }} className="footer-link">Request Anime</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact us at: support@yohoanime.com"); }} className="footer-link">Contact</a>
            <a href="#friends" onClick={(e) => { e.preventDefault(); alert("Our partner networks will be listed here."); }} className="footer-link">Friends</a>
          </div>
        </div>

        {/* Copyright & Disclaimer Section */}
        <div className="footer-meta-section">
          <p className="copyright-text">Copyright &copy; yohoanime.com. All Rights Reserved</p>
          <p className="disclaimer-text">
            This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
};
