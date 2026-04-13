import React, { useState } from 'react';
import Image from 'next/image';

// Local logo from public/assets/logo.png
const LOGO_SRC = '/assets/logo.png';

type LogoPixelMarketProps = {
  size?: number;
  hoverBelow?: boolean;
};

function LogoPixelMarket({ size = 64, hoverBelow = false }: LogoPixelMarketProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageError = () => {
    // If the image fails to load, show a visual placeholder
    setImageLoadError(true);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          outline: 'none',
        }}
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setShowTitle(true)}
        onMouseLeave={() => setShowTitle(false)}
        onFocus={() => setShowTitle(true)}
        onBlur={() => setShowTitle(false)}
        aria-label="View full logo"
      >
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          position: 'relative',
          background: imageLoadError ? '#1e293b' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!imageLoadError ? (
            <Image
              src={LOGO_SRC}
              alt="PixelMarket Logo"
              width={size}
              height={size}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={handleImageError}
              priority
            />
          ) : (
            // Visual fallback when no image can be loaded
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              fontWeight: 'bold',
            }}>
              PM
            </div>
          )}
          {!hoverBelow && (
            <div
              aria-hidden={!showTitle}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.9rem',
                pointerEvents: 'none',
                background: 'rgba(15, 23, 42, 0.65)',
                WebkitBackdropFilter: 'blur(6px)',
                backdropFilter: 'blur(6px)',
                opacity: showTitle ? 1 : 0,
                transform: showTitle ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '50%'
              }}
            >
              PixelMarket
            </div>
          )}
        </div>
      </button>
      {hoverBelow && showTitle && (
        <div
          style={{
            marginTop: '8px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#1e293b',
          }}
        >
          PixelMarket
        </div>
      )}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={LOGO_SRC}
              alt="PixelMarket Full Logo"
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                background: '#fff',
              }}
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LogoPixelMarket;
