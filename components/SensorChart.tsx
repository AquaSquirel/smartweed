'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SensorReading } from '@/lib/sensor';

interface ChartConfig {
  dataKey: keyof SensorReading;
  label: string;
  unit: string;
  color: string;
  gradientId: string;
}

interface SensorChartProps {
  data: SensorReading[];
  config: ChartConfig;
  height?: number;
}

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ color: '#4ade8088', fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#dcfce7', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {payload[0].value?.toFixed(1)}{' '}
        <span style={{ color: '#86efac', fontSize: 13, fontWeight: 500 }}>{unit}</span>
      </p>
    </div>
  );
}

export default function SensorChart({ data, config, height = 200 }: SensorChartProps) {
  const { dataKey, label, unit, color, gradientId } = config;
  const displayData = data.slice(-60);

  return (
    <div className="glass-card glow-sm p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#86efac' }}>
          {label}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}30`,
        }}>
          {unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={displayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.07)" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fill: '#4ade8055', fontSize: 10 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: '#4ade8055', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip unit={unit} />}
            cursor={{ stroke: `${color}40`, strokeWidth: 1 }}
          />
          <Area
            type="linear"
            dataKey={dataKey as string}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ r: 2.5, fill: color, stroke: '#0a1f0e', strokeWidth: 1, opacity: 0.7 }}
            activeDot={{
              r: 5,
              fill: color,
              stroke: '#0a1f0e',
              strokeWidth: 2,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
