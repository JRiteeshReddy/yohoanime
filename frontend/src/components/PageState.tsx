import React, { useState, useEffect } from 'react';
import './PageState.css';

export const Loader = ({ delay = 350 }: { delay?: number }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="page-state-container loader-screen">
      <div className="loader-logo-wrapper">
        <img src="/images/Icon.png" alt="Loading..." className="loader-skull" />
      </div>
      <p className="yoho-loading-text">Yohohoho...</p>
    </div>
  );
};

export const ErrorScreen = ({ message = "Something went wrong. Please try again.", onRetry }: { message?: string; onRetry?: () => void }) => {
  return (
    <div className="page-state-container">
      <img src="/images/Icon.png" alt="Error" className="error-screen-icon" />
      <h2 className="error-title">Oops!</h2>
      <p className="page-state-text error-msg">{message}</p>
      {onRetry && (
        <button className="button retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
