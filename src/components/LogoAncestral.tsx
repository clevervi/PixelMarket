import React, { useState } from 'react';
import Image from 'next/image';

// Logo local desde public/assets/logo.png
const LOGO_SRC = '/assets/logo.png';

type LogoAncestralProps = {
  size?: number;
  hoverBelow?: boolean;
};

function LogoAncestral({ size = 120, hoverBelow = false }: LogoAncestralProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageError = () => {
    // Si la imagen falla, mostrar placeholder visual
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
        aria-label="Ver logo completo"
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          position: 'relative',
          background: imageLoadError ? '#8B4513' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!imageLoadError ? (
            <Image
              src={LOGO_SRC}
              alt="Logo Ancestral Heartbeat"
              width={64}
              height={64}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={handleImageError}
              priority
            />
          ) : (
            // Fallback visual cuando ninguna imagen carga
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
              ♥
            </div>
          )}
          {/* Antes/Después: overlay difuminado que aparece al hover/focus */}
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
              background: 'rgba(0,0,0,0.32)',
              WebkitBackdropFilter: 'blur(4px)',
              backdropFilter: 'blur(4px)',
              opacity: showTitle ? 1 : 0,
              transform: showTitle ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 220ms ease, transform 220ms ease',
              borderRadius: '50%'
            }}
          >
            Ancestral Heartbeat
          </div>
        </div>
      </button>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
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
                top: '-30px',
                right: '0',
                background: '#fff',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#8B4513',
                fontWeight: 'bold',
                padding: '0 10px',
                lineHeight: '1',
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <img
              src={LOGO_SRC}
              alt="Logo completo"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                background: '#fff',
                justifyContent:'flex-end'
              }}
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoAncestral;
