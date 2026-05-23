export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string | null;
  field2: string | null;
  field3: string | null;
}

export interface ThingSpeakChannel {
  id: number;
  name: string;
  field1: string;
  field2: string;
  field3: string;
  last_entry_id: number;
  created_at: string;
  updated_at: string;
}

export interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}

export interface SensorReading {
  timestamp: string;
  time: string;
  date: string;
  temperature: number | null;
  humidity: number | null;
  light: number | null;
  lightPct: number | null;
  entryId: number;
}

function toNum(raw: string | null): number | null {
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : parseFloat(n.toFixed(1));
}

export function parseFeeds(feeds: ThingSpeakFeed[]): SensorReading[] {
  return feeds
    .map((feed) => {
      const date = new Date(feed.created_at);
      const rawLight = feed.field3 ? parseFloat(feed.field3) : null;
      return {
        timestamp: feed.created_at,
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        temperature: toNum(feed.field1),
        humidity: toNum(feed.field2),
        light: rawLight !== null && !isNaN(rawLight) ? rawLight : null,
        lightPct: rawLight !== null && !isNaN(rawLight) ? parseFloat(((rawLight / 1023) * 100).toFixed(1)) : null,
        entryId: feed.entry_id,
      };
    })
    .filter((r) => r.temperature !== null || r.humidity !== null || r.light !== null);
}

export function getLatestReading(readings: SensorReading[]): SensorReading | null {
  return readings.length > 0 ? readings[readings.length - 1] : null;
}

export function getTrend(readings: SensorReading[], key: 'temperature' | 'humidity' | 'lightPct'): number | null {
  if (readings.length < 2) return null;
  const latest = readings[readings.length - 1][key];
  const previous = readings[readings.length - 2][key];
  if (latest === null || previous === null) return null;
  return parseFloat((latest - previous).toFixed(1));
}

export function getMinMax(readings: SensorReading[], key: 'temperature' | 'humidity' | 'lightPct') {
  const values = readings.map((r) => r[key]).filter((v): v is number => v !== null && !isNaN(v));
  if (values.length === 0) return { min: null, max: null };
  return {
    min: parseFloat(Math.min(...values).toFixed(1)),
    max: parseFloat(Math.max(...values).toFixed(1)),
  };
}
