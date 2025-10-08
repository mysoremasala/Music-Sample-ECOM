import React from 'react';

const MarqueeBanner = ({ text }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>// {text} //</span>
        <span>// {text} //</span>
        <span>// {text} //</span>
        <span>// {text} //</span>
      </div>
      
      <style jsx>{`
        .marquee-container {
          width: 100%;
          /* --- START: MODIFICATION --- */
          /* Added semi-transparent background and blur effect */
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          /* --- END: MODIFICATION --- */
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
        
        .marquee-content span {
          display: inline-block;
          padding: 8px 0;
          margin-right: 50px;
          color: #0ff;
          font-family: 'Orbitron', 'Rajdhani', sans-serif;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @media (max-width: 768px) {
          .marquee-content span {
            font-size: 0.8rem;
            padding: 6px 0;
          }
          /* --- START: MODIFICATION --- */
          /* Explicitly set height for mobile to ensure consistent layout */
          .marquee-container {
             height: 2rem; 
             display: flex;
             align-items: center;
          }
          /* --- END: MODIFICATION --- */
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;