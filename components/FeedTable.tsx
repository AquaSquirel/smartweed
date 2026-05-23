'use client';

import { SensorReading } from '@/lib/thingspeak';

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
              {['#', 'Data', 'Hora', 'Temperatura', 'Umidade', 'Luminosidade'].map((h) => (
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
              <tr key={r.entryId} className={`table-row-hover ${i === 0 ? 'latest-row' : ''}`}>
                <td className="py-2 pr-4 font-mono text-xs" style={{ color: '#4ade8055' }}>
                  {r.entryId}
                </td>
                <td className="py-2 pr-4" style={{ color: '#86efac' }}>{r.date}</td>
                <td className="py-2 pr-4 font-mono" style={{ color: '#86efac' }}>{r.time}</td>
                <td className="py-2 pr-4">
                  {r.temperature !== null ? (
                    <span className="flex items-center gap-1">
                      <span style={{ color: i === 0 ? '#4ade80' : '#dcfce7' }} className="font-semibold">
                        {r.temperature.toFixed(1)}
                      </span>
                      <span style={{ color: '#4ade8055' }} className="text-xs">°C</span>
                    </span>
                  ) : <span style={{ color: '#4ade8033' }}>—</span>}
                </td>
                <td className="py-2 pr-4">
                  {r.humidity !== null ? (
                    <span className="flex items-center gap-1">
                      <span style={{ color: i === 0 ? '#38bdf8' : '#dcfce7' }} className="font-semibold">
                        {r.humidity.toFixed(1)}
                      </span>
                      <span style={{ color: '#4ade8055' }} className="text-xs">%</span>
                    </span>
                  ) : <span style={{ color: '#4ade8033' }}>—</span>}
                </td>
                <td className="py-2">
                  {r.lightPct !== null ? (
                    <span className="flex items-center gap-2">
                      <span style={{ color: i === 0 ? '#facc15' : '#dcfce7' }} className="font-semibold">
                        {r.lightPct.toFixed(0)}
                      </span>
                      <span style={{ color: '#4ade8055' }} className="text-xs">%</span>
                      <span
                        className="inline-block h-1.5 rounded-full"
                        style={{
                          width: `${Math.max(8, r.lightPct * 0.5)}px`,
                          background: `rgba(250,204,21,${0.3 + (r.lightPct / 100) * 0.7})`,
                        }}
                      />
                    </span>
                  ) : <span style={{ color: '#4ade8033' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
