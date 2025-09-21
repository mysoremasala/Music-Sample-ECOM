import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid'; // We'll reuse your existing ProductGrid

const WorkPage = ({ onAddToCart, onBackToHome }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      paddingTop: '15vh', // Extra padding to account for the fixed navbar
      paddingBottom: '5vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(100px)', zIndex: 0
      }}></div>

      {/* Work Page Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeIn 0.8s ease-out',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '300', color: 'white',
          letterSpacing: '0.1em', margin: '0 0 1rem 0'
        }}>
          Our Work
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          fontWeight: '300',
          lineHeight: '1.8',
          margin: '0 auto 4rem auto',
          maxWidth: '700px'
        }}>
          Explore our collection of premium, royalty-free sample packs. Each pack is designed to provide the highest quality sounds to fuel your creativity and elevate your music production.
        </p>

        {/* --- We reuse your ProductGrid component here --- */}
        <ProductGrid onAddToCart={onAddToCart} />

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '1rem 2rem', fontSize: '1rem', fontWeight: '300', letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease',
            marginTop: '4rem'
          }}
           onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.color = 'black'; }}
           onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; }}
        >
          Back to Home
        </button>
      </div>

       <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WorkPage;
