import React, { useState } from 'react';

interface ChartProps {
  data: Record<string, number>;
  loading?: boolean;
  theme?: 'light' | 'dark';
}

export const GravityDonutChart: React.FC<ChartProps> = ({ data, loading, theme = 'light' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const entries = Object.entries(data).filter(([_, val]) => val > 0);
  const total = entries.reduce((acc, [_, val]) => acc + val, 0);

  // Paleta de colores para la Gravedad
  const colorMap: Record<string, { color: string; border: string; text: string; bg: string }> = {
    Alta: { color: '#ef4444', border: 'border-red-500/20 dark:border-red-500/10', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
    Media: { color: '#f59e0b', border: 'border-amber-500/20 dark:border-amber-500/10', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    Baja: { color: '#10b981', border: 'border-emerald-500/20 dark:border-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin"></div>
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mt-4"></div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 text-slate-400 dark:text-slate-500">
        Sin datos suficientes para graficar
      </div>
    );
  }

  // Cálculos para el SVG de dona
  let accumulatedAngle = 0;
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const slices = entries.map(([name, val], idx) => {
    const percentage = val / total;
    const strokeLength = percentage * circumference;
    const strokeOffset = circumference - accumulatedAngle;
    accumulatedAngle += strokeLength;

    const colors = colorMap[name] || { color: '#94a3b8', border: 'border-slate-500/10', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' };

    return {
      name,
      value: val,
      percentage: (percentage * 100).toFixed(1),
      strokeLength,
      strokeOffset,
      colors,
      index: idx,
    };
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center gap-6 glass-panel">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(226, 232, 240, 0.8)'}
            strokeWidth={strokeWidth}
          />
          {slices.map((slice) => (
            <circle
              key={slice.name}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={slice.colors.color}
              strokeWidth={strokeWidth + (hoveredIndex === slice.index ? 3 : 0)}
              strokeDasharray={`${slice.strokeLength} ${circumference}`}
              strokeDashoffset={slice.strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Cifra de datos al centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredIndex !== null ? (
            <>
              <span className="text-2xl font-bold font-sans text-slate-850 dark:text-slate-100">
                {slices[hoveredIndex].value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                {slices[hoveredIndex].name}
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {total}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Total
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-3 w-full">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Distribución de Gravedad</h4>
        <div className="flex flex-col gap-2">
          {slices.map((slice) => (
            <div
              key={slice.name}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                hoveredIndex === slice.index
                  ? `${slice.colors.bg} ${slice.colors.border} translate-x-1`
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.colors.color }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{slice.name}</span>
              </div>
              <div className="text-right text-sm">
                <span className="font-bold text-slate-900 dark:text-slate-100">{slice.value} </span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">({slice.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TypesBarChart: React.FC<ChartProps> = ({ data, loading }) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...Object.values(data), 1);
  const total = Object.values(data).reduce((acc, val) => acc + val, 0);

  // Paleta ecológica/industrial para tipos
  const getBarColor = (tipo: string, isHovered: boolean) => {
    const colors: Record<string, string> = {
      Aire: 'from-emerald-500 to-teal-600',
      Agua: 'from-blue-500 to-cyan-600',
      Suelos: 'from-amber-600 to-orange-700',
      Residuos: 'from-rose-500 to-red-600',
      Lumínica: 'from-yellow-400 to-amber-500',
      Acústica: 'from-purple-500 to-violet-600',
      Otro: 'from-slate-500 to-slate-600',
    };

    const gradient = colors[tipo] || 'from-emerald-400 to-emerald-600';
    return isHovered ? `${gradient} opacity-100 shadow-lg shadow-emerald-500/20` : `${gradient} opacity-85`;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3 flex-grow justify-end flex flex-col">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 text-slate-400 dark:text-slate-550">
        Sin datos de contaminación registrados
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 glass-panel">
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Tipos de Contaminación Registrados</h4>
      <div className="space-y-4">
        {entries.map(([name, val]) => {
          const widthPercent = (val / maxVal) * 100;
          const isHovered = hoveredKey === name;

          return (
            <div
              key={name}
              className="space-y-1.5"
              onMouseEnter={() => setHoveredKey(name)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">{val}</strong>{' '}
                  {val === 1 ? 'denuncia' : 'denuncias'}
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/30">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getBarColor(name, isHovered)} transition-all duration-500 ease-out`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
