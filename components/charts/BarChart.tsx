import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; avatar?: string }[];
  title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);
  const chartHeight = 200;
  const barWidth = 40;
  const barMargin = 30;
  const chartWidth = data.length * (barWidth + barMargin) + barMargin;

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-xl font-bold text-center mb-6 text-[var(--color-text-primary)]">{title}</h3>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`} className="w-full h-auto" aria-label={title} role="img">
        <defs>
          {data.map((d, i) => (
            <clipPath key={`clip-${d.label}`} id={`clip-avatar-${i}`}>
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          ))}
        </defs>
        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="var(--color-border)" strokeWidth="2" />
        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
          const x = i * (barWidth + barMargin) + barMargin;
          const y = chartHeight - barHeight;
          return (
            <g key={d.label}>
              <title>{`${d.label}: ${d.value}%`}</title>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                className="fill-current text-[var(--color-accent-primary)] transition-all duration-300 hover:opacity-80"
              />
              <text x={x + barWidth / 2} y={chartHeight + 10} textAnchor="middle" dominantBaseline="hanging" className="text-xs fill-current text-[var(--color-text-secondary)] font-semibold">
                {d.label}
              </text>
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-sm fill-current text-[var(--color-text-primary)] font-bold">
                {d.value}%
              </text>
              {d.avatar ? (
                d.avatar.startsWith('data:image') ? (
                  <g transform={`translate(${x + barWidth / 2 - 12}, ${chartHeight + 25})`}>
                    <image href={d.avatar} width="24" height="24" clipPath={`url(#clip-avatar-${i})`} />
                  </g>
                ) : (
                  <text x={x + barWidth / 2} y={chartHeight + 40} textAnchor="middle" fontSize="18">
                    {d.avatar}
                  </text>
                )
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};