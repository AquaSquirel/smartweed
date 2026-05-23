'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  isOnline: boolean;
  lastUpdated: Date | null;
  refreshIn: number;
  channelName?: string;
}

export default function Header({ isOnline, lastUpdated, refreshIn, channelName }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;
    setTimeStr(lastUpdated.toLocaleTimeString('pt-BR'));
  }, [lastUpdated]);

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 mb-2">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            boxShadow: '0 0 16px rgba(34,197,94,0.15)',
          }}
        >
          🌿
        </div>
        <div>
          <h1
            className="font-bold text-xl tracking-tight gradient-text leading-none"
          >
            SmartWeed
          </h1>
          {channelName && (
            <p className="text-xs mt-0.5" style={{ color: '#4ade8055' }}>
              {channelName}
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Refresh countdown */}
        <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: '#4ade8066' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>
            {refreshIn > 0 ? `Atualiza em ${refreshIn}s` : 'Atualizando...'}
          </span>
        </div>

        {/* Last updated */}
        {timeStr && (
          <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: '#4ade8066' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeStr}</span>
          </div>
        )}

        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: isOnline ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${isOnline ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: isOnline ? '#4ade80' : '#f87171',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="status-ping absolute inline-flex h-full w-full rounded-full"
              style={{ background: isOnline ? '#22c55e' : '#ef4444' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: isOnline ? '#22c55e' : '#ef4444' }}
            />
          </span>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
    </header>
  );
}
