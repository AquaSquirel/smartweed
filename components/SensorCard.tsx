'use client';

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: string;
  trend: number | null;
  min: number | null;
  max: number | null;
  rangeMax: number;
  color: string;
  delay?: string;
}

export default function SensorCard({
  icon,
  label,
  value,
  unit,
  trend,
  min,
  max,
  rangeMax,
  color,
  delay = '',
}: SensorCardProps) {
  const pct = value !== null ? Math.min(100, Math.max(0, (value / rangeMax) * 100)) : 0;
  const isUp = trend !== null && trend > 0;
  const isDown = trend !== null && trend < 0;

  return (
    <div className={`glass-card glow-sm p-6 animate-fade-up ${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span style={{ color, filter: `drop-shadow(0 0 8px ${color}60)` }} className="text-2xl">
            {icon}
          </span>
          <span className="text-sm font-medium" style={{ color: '#86efac' }}>
            {label}
          </span>
        </div>
        {trend !== null && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: isUp
                ? 'rgba(34,197,94,0.12)'
                : isDown
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(255,255,255,0.06)',
              color: isUp ? '#4ade80' : isDown ? '#f87171' : '#86efac',
            }}
          >
            {isUp ? '↑' : isDown ? '↓' : '→'}
            {Math.abs(trend).toFixed(1)}
          </div>
        )}
      </div>

      <div className="mb-4">
        {value !== null ? (
          <div className="flex items-end gap-2">
            <span
              className="sensor-value font-bold"
              style={{ fontSize: '2.8rem', color: '#dcfce7' }}
            >
              {value.toFixed(value % 1 === 0 ? 0 : 1)}
            </span>
            <span className="text-lg font-medium mb-2" style={{ color: '#86efac' }}>
              {unit}
            </span>
          </div>
        ) : (
          <div className="skeleton h-12 w-32" />
        )}
      </div>

      <div className="progress-track mb-3">
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }} />
      </div>

      <div className="flex justify-between text-xs" style={{ color: '#4ade8088' }}>
        <span>Mín: <span style={{ color: '#86efac' }}>{min !== null ? `${min}${unit}` : '—'}</span></span>
        <span>Máx: <span style={{ color: '#86efac' }}>{max !== null ? `${max}${unit}` : '—'}</span></span>
      </div>
    </div>
  );
}
