import React from 'react';
import './ErrorPage.css';

const ErrorPage = ({ statusCode = 404 }) => {
  const errorConfig = {
    403: {
      title: '403 FORBIDDEN',
      message: 'Yeah... you are not allowed here. GO BACK!',
      image: '/images/403.jpeg',
      alt: 'Access Forbidden'
    },
    404: {
      title: '404 NOT FOUND',
      message: 'Idk, something\'s missing...',
      image: '/images/404.jpeg',
      alt: 'Page Not Found'
    },
    500: {
      title: '50X SERVER ERROR',
      message: 'Something\'s wrong but I\'ll get it fixed once I\'m out of this mimic',
      image: '/images/50x.jpeg',
      alt: 'Server Error'
    }
  };

  const config = errorConfig[statusCode] || errorConfig[404];

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-image-wrapper">
          <img src={config.image} alt={config.alt} className="error-image" />
        </div>
        <h1 className="error-title">{config.title}</h1>
        <p className="error-message">{config.message}</p>
        <a href="/" className="error-button">
          RETURN HOME
        </a>
      </div>

      {/* Matrix effect background */}
      <div className="error-matrix-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="matrix-line" />
        ))}
      </div>
    </div>
  );
};

export default ErrorPage;
