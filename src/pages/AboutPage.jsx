import React from 'react';

const AboutPage = ({ onBackToHome }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '10vh',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(100px)', animation: 'float 6s ease-in-out infinite'
      }}></div>

      {/* About Us Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 'clamp(2rem, 5vw, 3rem)',
        borderRadius: '0',
        backdropFilter: 'blur(20px)',
        maxWidth: '800px',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeIn 0.8s ease-out',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '300', color: 'white',
          letterSpacing: '0.1em', margin: '0 0 2rem 0'
        }}>
          About Us
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          fontWeight: '300',
          lineHeight: '1.8',
          margin: '0 0 1.5rem 0'
        }}>
          Founded by Krish Vinod, Parth Ghadge, Saad Feroz, Suyash Nair our mission is to empower music producers and artists with the highest quality, royalty-free sound packs. We believe that great music starts with great sounds.
        </p>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          fontWeight: '300',
          lineHeight: '1.8',
          margin: '0 0 3rem 0'
        }}>
          Every sample is meticulously crafted to inspire creativity and elevate your productions. Whether you're a seasoned professional or just starting, our packs are designed to be the foundation of your next hit.
        </p>

        <button
          onClick={onBackToHome}
          style={{
            background: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '1rem 2rem', fontSize: '1rem', fontWeight: '300', letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease', width: '100%', maxWidth: '300px'
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
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
