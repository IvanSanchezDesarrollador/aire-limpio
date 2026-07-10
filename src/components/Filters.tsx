import React from 'react';
import type { FiltrosDenuncia } from '../types';
import { Search, Filter, Calendar, RotateCcw } from 'lucide-react';

interface FiltersProps {
  filtros: FiltrosDenuncia;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosDenuncia>>;
  onReset: () => void;
  theme?: 'light' | 'dark';
}

export const Filters: React.FC<FiltersProps> = ({ filtros, setFiltros, onReset }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 glass-panel space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Filter size={18} />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Buscador y Filtros Interactivos</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-100 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/30 hover:border-emerald-200 dark:hover:border-emerald-500/20 font-medium"
        >
          <RotateCcw size={13} />
          Restablecer Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Buscador Global */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Buscador por Texto
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-505" size={16} />
            <input
              type="text"
              name="busqueda"
              value={filtros.busqueda}
              onChange={handleChange}
              placeholder="Buscar empresa, dirección..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Tipo de Contaminación */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-2">
            Tipo de Contaminación
          </label>
          <select
            name="tipo"
            value={filtros.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            <option value="Aire">💨 Aire (Emisiones/Humo)</option>
            <option value="Agua">💧 Agua (Efluentes/Derrame)</option>
            <option value="Suelos">🌱 Suelos (Contaminación/Residuos)</option>
            <option value="Residuos">🗑️ Residuos (Acumulación Basura)</option>
            <option value="Lumínica">💡 Lumínica (Luz Artificial)</option>
            <option value="Acústica">🔊 Acústica (Ruido de Muelle/Fbca)</option>
            <option value="Otro">📁 Otro</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
            Estado de Gestión
          </label>
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="En Proceso">🔄 En Proceso</option>
            <option value="Resuelto">✅ Resuelto</option>
            <option value="Desestimado">❌ Desestimado</option>
          </select>
        </div>

        {/* Gravedad */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
            Gravedad
          </label>
          <select
            name="gravedad"
            value={filtros.gravedad}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="">Todas las gravedades</option>
            <option value="Alta">🔴 Alta</option>
            <option value="Media">🟡 Media</option>
            <option value="Baja">🟢 Baja</option>
          </select>
        </div>

        {/* Rango de Fechas */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
            Desde / Hasta
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500" size={13} />
              <input
                type="date"
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleChange}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <span className="text-slate-400 dark:text-slate-650 text-xs">al</span>
            <div className="relative flex-grow">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500" size={13} />
              <input
                type="date"
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleChange}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
