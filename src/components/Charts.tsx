import React, { useState, useMemo } from 'react';
import type { Denuncia } from '../types';

interface ChartProps {
  data?: Record<string, number>;
  denuncias?: Denuncia[];
  loading?: boolean;
  theme?: 'light' | 'dark';
}

export const GravityDonutChart: React.FC<ChartProps> = ({ data = {}, loading, theme = 'light' }) => {
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
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 text-slate-400 dark:text-slate-550">
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
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center gap-6 glass-panel shadow-sm">
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
              <span className="text-xs text-slate-550 dark:text-slate-455 uppercase tracking-wider">
                {slices[hoveredIndex].name}
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {total}
              </span>
              <span className="text-[10px] text-slate-555 dark:text-slate-400 uppercase tracking-widest">
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

export const TypesBarChart: React.FC<ChartProps> = ({ data = {}, loading }) => {
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
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 glass-panel shadow-sm">
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
                <span className="text-slate-505 dark:text-slate-400">
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

export const CompaniesBarChart: React.FC<ChartProps> = ({ denuncias = [], loading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Procesar las denuncias para obtener las empresas con más denuncias
  const companyCounts: [string, number][] = useMemo(() => {
    const counts: Record<string, number> = {};
    denuncias.forEach(d => {
      const name = d.empresa ? d.empresa.trim() : 'Responsable no identificado';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Obtener Top 5
  }, [denuncias]);

  if (loading) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-4 flex-grow justify-center flex flex-col">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (companyCounts.length === 0) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 text-slate-400 dark:text-slate-550">
        Sin reportes de empresas identificadas
      </div>
    );
  }

  const maxCount = Math.max(...companyCounts.map((c: [string, number]) => c[1]), 1);

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 glass-panel shadow-sm">
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Infractores Más Reportados (Top 5)</h4>
      <div className="space-y-4">
        {companyCounts.map(([name, count]: [string, number], idx: number) => {
          const widthPercent = (count / maxCount) * 100;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={name}
              className="space-y-1.5 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-350 truncate max-w-[220px]" title={name}>
                  {name}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold">
                  {count} {count === 1 ? 'reporte' : 'reportes'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/30">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-550 ease-out ${
                    isHovered ? 'brightness-110 shadow-sm' : ''
                  }`}
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

export const TrendLineChart: React.FC<ChartProps> = ({ denuncias = [], loading, theme = 'light' }) => {
  // Agrupar denuncias de los últimos 7 días
  const trendData: { date: string; count: number }[] = useMemo(() => {
    const daysMap: Record<string, number> = {};
    
    // Rellenar últimos 7 días con 0 por defecto
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
      daysMap[key] = 0;
    }

    denuncias.forEach(denuncia => {
      const key = new Date(denuncia.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
      if (key in daysMap) {
        daysMap[key] += 1;
      }
    });

    return Object.entries(daysMap).map(([date, count]) => ({ date, count }));
  }, [denuncias]);

  if (loading) {
    return (
      <div className="w-full h-64 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="w-full h-32 bg-slate-100 dark:bg-slate-850 rounded"></div>
      </div>
    );
  }

  const maxCount = Math.max(...trendData.map((d: { date: string; count: number }) => d.count), 1);
  const chartHeight = 100;
  const chartWidth = 320;
  const padding = 20;

  // Generar puntos del gráfico SVG de línea/área
  const points = trendData.map((d: { date: string; count: number }, idx: number) => {
    const x = padding + (idx * (chartWidth - 2 * padding)) / (trendData.length - 1);
    const y = chartHeight - padding - (d.count * (chartHeight - 2 * padding)) / maxCount;
    return { x, y, ...d };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 glass-panel shadow-sm">
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Historial Reciente (Últimos 7 Días)</h4>
      
      <div className="w-full flex justify-center">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36 overflow-visible">
          {/* Defs para gradiente del área */}
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas horizontales de guía */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth={1} />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} strokeWidth={1} />

          {/* Relleno de Área */}
          {areaPath && <path d={areaPath} fill="url(#gradientArea)" />}

          {/* Línea Principal */}
          {linePath && <path d={linePath} fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}

          {/* Nodos de puntos */}
          {points.map((p: { x: number; y: number; date: string; count: number }, idx: number) => (
            <g key={idx} className="group/node cursor-pointer">
              <circle cx={p.x} cy={p.y} r={4} fill="#ffffff" stroke="#10b981" strokeWidth={2} />
              <circle cx={p.x} cy={p.y} r={8} fill="#10b981" fillOpacity={0} className="hover:fill-opacity-20 transition-all" />
              {/* Tooltip flotante simple */}
              <title>{`${p.date}: ${p.count} denuncias`}</title>
            </g>
          ))}

          {/* Etiquetas del Eje X */}
          {points.map((p: { x: number; y: number; date: string; count: number }, idx: number) => (
            <text
              key={idx}
              x={p.x}
              y={chartHeight - 4}
              fontSize={8}
              fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
              textAnchor="middle"
              className="font-medium"
            >
              {p.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
