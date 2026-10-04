import { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onFinish();
      }, 400); // Wait for fade-out transition
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      onFinish();
    }, 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg, #0E1018)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity: fading ? 0 : 1,
        transform: fading ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: fading ? 'none' : 'auto'
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #3D5AFE 0%, #7C93FF 100%)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 42,
          boxShadow: '0 12px 36px rgba(61,90,254,0.35)',
          marginBottom: 20,
          animation: 'pop 0.8s ease'
        }}
      >
        🔥
      </div>

      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--ink, #EEF0FA)',
          marginBottom: 8
        }}
      >
        Challenge
      </h1>

      <p
        className="mut"
        style={{
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.02em',
          marginBottom: 32,
          textAlign: 'center'
        }}
      >
        Commit · Persevere · Achieve
      </p>

      <div
        style={{
          width: 140,
          height: 4,
          background: 'var(--line, #262A3B)',
          borderRadius: 99,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'var(--ac, #3D5AFE)',
            borderRadius: 99,
            animation: 'grow 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        />
      </div>

      <button
        type="button"
        onClick={handleSkip}
        style={{
          marginTop: 24,
          background: 'none',
          border: 0,
          color: 'var(--mut, #9096B3)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        Tap to enter →
      </button>
    </div>
  );
}
