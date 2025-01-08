import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/NoPage.css';

const NoPage = () => {
  return (
    <div className="no-page-container">
      <div className="no-page-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Oops! Page Not Found</h2>
        <p className="error-description">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="back-to-home">
          Go back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
