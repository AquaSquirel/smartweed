'use client';

import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { SensorReading, getLatestReading, getTrend, getMinMax } from '@/lib/sensor';
import Header from './Header';
import SensorCard from './SensorCard';
import SensorChart from './SensorChart';
import FeedTable from './FeedTable';

const REFRESH_INTERVAL = 5_000;

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || 'Erro ao buscar dados');
  }
  return res.json() as Promise<{ readings: SensorReading[] }>;
}

export default function Dashboard() {
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, error, isLoading, mutate } = useSWR<{ readings: SensorReading[] }>(
    '/api/sensors',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: false,
      onSuccess: () => {
        setLastUpdated(new Date());
        setRefreshIn(REFRESH_INTERVAL / 1000);
      },
    }
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRefreshIn((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const readings = data?.readings ?? [];
  const latest = getLatestReading(readings);
  const trend = getTrend(readings);
  const { min, max } = getMinMax(readings);

  const isOnline = !error && !isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isOnline={false} lastUpdated={null} refreshIn={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              🌿
            </div>
            <div className="skeleton h-4 w-48 mx-auto mb-2" />
            <div className="skeleton h-3 w-32 mx-auto" />
            <p className="mt-4 text-sm" style={{ color: '#4ade8066' }}>Carregando dados do sensor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isOnline={false} lastUpdated={lastUpdated} refreshIn={refreshIn} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            className="glass-card p-8 max-w-md w-full text-center"
            style={{ borderColor: 'rgba(239,68,68,0.25)' }}
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#f87171' }}>
              Erro de conexão
            </h2>
            <p className="text-sm mb-6" style={{ color: '#86efac' }}>
              {error.message}
            </p>
            <button
              onClick={() => mutate()}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#4ade80',
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isOnline={isOnline} lastUpdated={lastUpdated} refreshIn={refreshIn} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">📡</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#86efac' }}>
              Aguardando dados
            </h2>
            <p className="text-sm" style={{ color: '#4ade8088' }}>
              Nenhuma leitura recebida ainda. O ESP32 enviará dados assim que conectado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header
        isOnline={isOnline}
        lastUpdated={lastUpdated}
        refreshIn={refreshIn}
        channelName={latest?.device_id}
      />

      <main className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">

        {/* Sensor Card */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SensorCard
            icon="📏"
            label="Distância"
            value={latest?.distance_cm ?? null}
            unit="cm"
            trend={trend}
            min={min}
            max={max}
            rangeMax={200}
            color="#22c55e"
            delay="delay-100"
          />
          <div className="glass-card glow-sm p-6 animate-fade-up delay-200 flex flex-col justify-between">
            <span className="text-sm font-medium" style={{ color: '#86efac' }}>Dispositivo</span>
            <div>
              <p className="font-bold text-lg mt-2" style={{ color: '#dcfce7' }}>{latest?.device_id ?? '—'}</p>
              <p className="text-xs mt-1" style={{ color: '#4ade8066' }}>Última transmissão: {latest?.time ?? '—'}</p>
            </div>
          </div>
          <div className="glass-card glow-sm p-6 animate-fade-up delay-300 flex flex-col justify-between">
            <span className="text-sm font-medium" style={{ color: '#86efac' }}>Total de leituras</span>
            <p className="font-bold text-4xl mt-2" style={{ color: '#dcfce7' }}>{readings.length}</p>
          </div>
        </section>

        {/* Distance chart */}
        <section className="mb-6 animate-fade-up delay-400" style={{ height: 280 }}>
          <SensorChart
            data={readings}
            config={{
              dataKey: 'distance_cm',
              label: 'Distância ao objeto (cm)',
              unit: 'cm',
              color: '#22c55e',
              gradientId: 'gradDist',
            }}
            height={220}
          />
        </section>

        {/* Feed table */}
        {readings.length > 0 && <FeedTable readings={readings} />}

        <footer className="mt-8 text-center text-xs" style={{ color: '#4ade8033' }}>
          <hr className="divider mb-4" />
          SmartWeed Dashboard · Sensor HC-SR04 via ESP32 · Atualização automática a cada 5s
        </footer>
      </main>
    </div>
  );
}
