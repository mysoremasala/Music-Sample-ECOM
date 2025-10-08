import { useState, useEffect } from 'react'; // 1. Import useEffect

const ProductDetail = ({ product, onClose, onAddToCart }) => {
  const [playingAudio, setPlayingAudio] = useState(null);
  // 2. Add state to track if the view is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 3. Add an effect to listen for screen size changes
  useEffect(() => {
    // Function to update the isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleAudioPlay = (audioUrl) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  if (!product) return null;

  // 4. Define the conditional style for the button container
  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    // If isMobile is true, add a negative margin to move it up
    marginTop: isMobile ? '-1.5rem' : '0',
    // Add a little bottom margin on mobile for spacing
    marginBottom: isMobile ? '1rem' : '0'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '0.5rem 1rem',
                fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                fontWeight: '300',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                {product.category}
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                fontWeight: '300'
              }}>
                {product.sampleCount} samples
              </span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
              fontWeight: '300',
              color: 'white',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              {product.title}
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              fontWeight: '300',
              marginBottom: '2rem'
            }}>
              {product.longDescription}
            </p>
          </div>

          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            marginBottom: '3rem',
            padding: 'clamp(1rem, 3vw, 2rem)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>BPM Range</h4>
              <p style={{ color: 'white' }}>{product.bpm}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Key</h4>
              <p style={{ color: 'white' }}>{product.key}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>File Size</h4>
              <p style={{ color: 'white' }}>{product.fileSize}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Price</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ color: 'white', fontSize: '1.25rem', margin: 0 }}>${product.price}</p>
                {product.originalPrice && (
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.5)', 
                    fontSize: '0.875rem', 
                    textDecoration: 'line-through',
                    margin: 0
                  }}>
                    ${product.originalPrice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Audio Previews */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}>
              Sample Previews
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.previews.map((preview, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>{preview.name}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>Duration: {preview.duration}</p>
                  
                  <audio
                    controls
                    preload="none"
                    onPlay={() => handleAudioPlay(preview.url)}
                    onPause={() => setPlayingAudio(null)}
                    onEnded={() => setPlayingAudio(null)}
                    style={{ width: '100%' }}
                  >
                    <source src={preview.url} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}>Features</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {product.features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          {/* 5. Apply the conditional style object here */}
          <div style={buttonContainerStyle}>
            <button 
              className="btn-primary" 
              onClick={handleAddToCart}
            >
              Add to Cart - ${product.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
