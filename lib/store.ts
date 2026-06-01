export interface SensorReading {
  id: number;
  timestamp: string;
  time: string;
  date: string;
  device_id: string;
  distance_cm: number;
}

const MAX_READINGS = 100;
const readings: SensorReading[] = [];

export function addReading(device_id: string, distance_cm: number): SensorReading {
  const now = new Date();
  const reading: SensorReading = {
    id: readings.length + 1,
    timestamp: now.toISOString(),
    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    device_id,
    distance_cm: parseFloat(distance_cm.toFixed(1)),
  };
  readings.push(reading);
  if (readings.length > MAX_READINGS) readings.shift();
  return reading;
}

export function getReadings(): SensorReading[] {
  return [...readings];
}
