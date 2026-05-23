'use client';

import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import {
  ThingSpeakResponse,
  parseFeeds,
  getLatestReading,
  getTrend,
  getMinMax,
} from '@/lib/thingspeak';
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
  return res.json() as Promise<ThingSpeakResponse>;
}

export default function Dashboard() {
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, error, isLoading, mutate } = useSWR<ThingSpeakResponse>(
    '/api/sensors?results=100',
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

  const readings = data?.feeds ? parseFeeds(data.feeds) : [];
  const latest = getLatestReading(readings);

  const tempTrend = getTrend(readings, 'temperature');
  const humTrend = getTrend(readings, 'humidity');
  const lightTrend = getTrend(readings, 'lightPct');

  const tempMM = getMinMax(readings, 'temperature');
  const humMM = getMinMax(readings, 'humidity');
  const lightMM = getMinMax(readings, 'lightPct');

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
            <p className="mt-4 text-sm" style={{ color: '#4ade8066' }}>Carregando dados do ThingSpeak...</p>
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
            <div
              className="text-xs p-3 rounded-lg mb-6 text-left font-mono"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#4ade8088', border: '1px solid rgba(34,197,94,0.1)' }}
            >
              <p>1. Crie o arquivo <strong style={{ color: '#4ade80' }}>.env.local</strong></p>
              <p className="mt-1">2. Adicione as variáveis:</p>
              <p className="mt-1 ml-2" style={{ color: '#22c55e' }}>THINGSPEAK_CHANNEL_ID=...</p>
              <p className="ml-2" style={{ color: '#22c55e' }}>THINGSPEAK_READ_API_KEY=...</p>
            </div>
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

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header
        isOnline={isOnline}
        lastUpdated={lastUpdated}
        refreshIn={refreshIn}
        channelName={data?.channel?.name}
      />

      <main className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">

        {/* Sensor Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SensorCard
            icon="🌡️"
            label="Temperatura"
            value={latest?.temperature ?? null}
            unit="°C"
            trend={tempTrend}
            min={tempMM.min}
            max={tempMM.max}
            rangeMax={50}
            color="#22c55e"
            delay="delay-100"
          />
          <SensorCard
            icon="💧"
            label="Umidade"
            value={latest?.humidity ?? null}
            unit="%"
            trend={humTrend}
            min={humMM.min}
            max={humMM.max}
            rangeMax={100}
            color="#38bdf8"
            delay="delay-200"
          />
          <SensorCard
            icon="☀️"
            label="Luminosidade"
            value={latest?.lightPct ?? null}
            unit="%"
            trend={lightTrend}
            min={lightMM.min}
            max={lightMM.max}
            rangeMax={100}
            color="#facc15"
            delay="delay-300"
          />
        </section>

        {/* Temperature chart — full width */}
        <section className="mb-4 animate-fade-up delay-400" style={{ height: 260 }}>
          <SensorChart
            data={readings}
            config={{
              dataKey: 'temperature',
              label: 'Temperatura (últimas leituras)',
              unit: '°C',
              color: '#22c55e',
              gradientId: 'gradTemp',
            }}
            height={210}
          />
        </section>

        {/* Humidity + Light charts */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="animate-fade-up delay-400" style={{ height: 240 }}>
            <SensorChart
              data={readings}
              config={{
                dataKey: 'humidity',
                label: 'Umidade',
                unit: '%',
                color: '#38bdf8',
                gradientId: 'gradHum',
              }}
              height={180}
            />
          </div>
          <div className="animate-fade-up delay-500" style={{ height: 240 }}>
            <SensorChart
              data={readings}
              config={{
                dataKey: 'lightPct',
                label: 'Luminosidade (LDR)',
                unit: '%',
                color: '#facc15',
                gradientId: 'gradLight',
              }}
              height={180}
            />
          </div>
        </section>

        {/* Feed table */}
        {readings.length > 0 && <FeedTable readings={readings} />}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs" style={{ color: '#4ade8033' }}>
          <hr className="divider mb-4" />
          SmartWeed Dashboard · Dados via ThingSpeak · Atualização automática a cada 15s
        </footer>
      </main>
    </div>
  );
}
