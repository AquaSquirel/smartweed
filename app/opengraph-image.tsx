import { ImageResponse } from 'next/og';

export const alt = 'SmartWeed Dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030a05',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 500,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Bottom glow */}
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.06) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 52 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: 20,
            background: 'rgba(34,197,94,0.13)',
            border: '2px solid rgba(34,197,94,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 46,
            boxShadow: '0 0 40px rgba(34,197,94,0.2)',
          }}>
            🌿
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#4ade80',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}>
              SmartWeed
            </span>
            <span style={{ fontSize: 22, color: '#86efac', letterSpacing: 1 }}>
              Dashboard IoT em tempo real
            </span>
          </div>
        </div>

        {/* Sensor cards */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 52 }}>
          {[
            { icon: '🌡️', value: '27.6°C', label: 'Temperatura', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
            { icon: '💧', value: '68.0%',  label: 'Umidade',     color: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
            { icon: '☀️', value: '5.4%',   label: 'Luminosidade',color: '#facc15', border: 'rgba(250,204,21,0.3)' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: 'rgba(10,31,14,0.9)',
                border: `1px solid ${card.border}`,
                borderRadius: 18,
                padding: '24px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                minWidth: 240,
                boxShadow: `0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              <span style={{ fontSize: 32 }}>{card.icon}</span>
              <span style={{ fontSize: 40, fontWeight: 700, color: card.color, lineHeight: 1, letterSpacing: '-1px' }}>
                {card.value}
              </span>
              <span style={{ fontSize: 15, color: '#86efac' }}>{card.label}</span>
            </div>
          ))}
        </div>

        {/* Tagline + URL */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#4ade8066',
            fontSize: 16,
          }}>
            <span>Wokwi</span>
            <span style={{ color: '#22c55e', fontSize: 20 }}>→</span>
            <span>ThingSpeak</span>
            <span style={{ color: '#22c55e', fontSize: 20 }}>→</span>
            <span>Dashboard</span>
          </div>
          <span style={{ color: '#4ade8033', fontSize: 15, letterSpacing: 1 }}>
            smartweed.mateuss.com.br
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
