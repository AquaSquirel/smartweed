import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          background: 'linear-gradient(135deg, #0a1f0e 0%, #030a05 100%)',
          borderRadius: 40,
          gap: 0,
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 120,
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.2) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <span style={{ fontSize: 100, lineHeight: 1 }}>🌿</span>
      </div>
    ),
    { ...size }
  );
}
