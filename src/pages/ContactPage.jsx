import React from 'react';

const ContactPage = ({ onBackToHome }) => {
  // --- START: THE FIX ---
  // Added the new contact information to this array
  const contactInfo = [
    {
      name: 'Krish Vinod',
      email: 'krishvinod1024@gmail.com',
      phone: '+91 7506497386',
    },
    {
      name: 'Parth Ghadge',
      email: 'Parthg17414@gmail.com',
      phone: '+91 9594835556',
    },
    {
      name: 'Suyash Nair',
      email: 'suyashnair@gmail.com',
      phone: '+91 8291003323',
    },
    {
      name: 'Saad Feroz',
      email: 'msaadferoz@gmail.com',
      phone: '+91 9819980890',
    },
  ];
  // --- END: THE FIX ---

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: 'clamp(2rem, 5vw, 3rem)',
    borderRadius: '0',
    backdropFilter: 'blur(20px)',
    width: '100%',
    position: 'relative',
    zIndex: 10,
    animation: 'fadeIn 0.8s ease-out',
  };

  const contactPersonStyle = {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const nameStyle = {
    color: 'white',
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: '300',
    letterSpacing: '0.05em',
    margin: '0 0 1rem 0',
  };

  const detailStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: '300',
    margin: '0.5rem 0',
    textDecoration: 'none',
    display: 'block',
    transition: 'color 0.3s ease',
  };

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
      overflow: 'hidden'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(100px)', animation: 'float 6s ease-in-out infinite'
      }}></div>

      {/* Contact Form Container */}
      <div style={{ ...cardStyle, maxWidth: '600px', top: '70px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '300', color: 'white',
          letterSpacing: '0.1em', margin: '0 0 3rem 0', textAlign: 'center'
        }}>
          Contact Us
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {contactInfo.map((person, index) => (
            <div key={index} style={index === contactInfo.length - 1 ? { ...contactPersonStyle, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : contactPersonStyle}>
              <h2 style={nameStyle}>{person.name}</h2>
              <a href={`mailto:${person.email}`} style={detailStyle} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                {person.email}
              </a>
              <a href={`tel:${person.phone.replace(/\s/g, '')}`} style={detailStyle} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                {person.phone}
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onBackToHome}
          style={{
            background: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '1rem', fontSize: '1rem', fontWeight: '300', letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease',
            marginTop: '3rem', width: '100%'
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

export default ContactPage;

