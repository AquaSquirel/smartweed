import { SensorReading } from './store';

export type { SensorReading };

export function getLatestReading(readings: SensorReading[]): SensorReading | null {
  return readings.length > 0 ? readings[readings.length - 1] : null;
}

export function getTrend(readings: SensorReading[]): number | null {
  if (readings.length < 2) return null;
  const a = readings[readings.length - 2].distance_cm;
  const b = readings[readings.length - 1].distance_cm;
  return parseFloat((b - a).toFixed(1));
}

export function getMinMax(readings: SensorReading[]): { min: number | null; max: number | null } {
  if (readings.length === 0) return { min: null, max: null };
  const values = readings.map((r) => r.distance_cm);
  return {
    min: parseFloat(Math.min(...values).toFixed(1)),
    max: parseFloat(Math.max(...values).toFixed(1)),
  };
}
