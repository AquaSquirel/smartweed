'use client';

import { SensorReading } from '@/lib/sensor';

interface FeedTableProps {
  readings: SensorReading[];
}

export default function FeedTable({ readings }: FeedTableProps) {
  const recent = [...readings].reverse().slice(0, 15);

  return (
    <div className="glass-card glow-sm p-5 animate-fade-up delay-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#86efac' }}>
          Últimas leituras
        </h3>
        <span className="text-xs" style={{ color: '#4ade8055' }}>
          {readings.length} registros carregados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {['#', 'Data', 'Hora', 'Dispositivo', 'Distância'].map((h) => (
                <th
                  key={h}
                  className="text-left pb-3 pr-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#4ade8066' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((r, i) => (
              <tr key={r.id} className={`table-row-hover ${i === 0 ? 'latest-row' : ''}`}>
                <td className="py-2 pr-4 font-mono text-xs" style={{ color: '#4ade8055' }}>
                  {r.id}
                </td>
                <td className="py-2 pr-4" style={{ color: '#86efac' }}>{r.date}</td>
                <td className="py-2 pr-4 font-mono" style={{ color: '#86efac' }}>{r.time}</td>
                <td className="py-2 pr-4" style={{ color: '#86efac' }}>{r.device_id}</td>
                <td className="py-2">
                  <span className="flex items-center gap-1">
                    <span style={{ color: i === 0 ? '#4ade80' : '#dcfce7' }} className="font-semibold">
                      {r.distance_cm.toFixed(1)}
                    </span>
                    <span style={{ color: '#4ade8055' }} className="text-xs">cm</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
