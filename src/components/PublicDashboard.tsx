import React from 'react';
import type { Denuncia, FiltrosDenuncia, MetricasGenerales } from '../types';
import { Filters } from './Filters';
import { Map } from './Map';
import { GravityDonutChart, TypesBarChart } from './Charts';
import { AlertCircle, ClipboardList, Flame, Sparkles, MapPin } from 'lucide-react';

interface PublicDashboardProps {
  denuncias: Denuncia[];
  filtros: FiltrosDenuncia;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosDenuncia>>;
  onResetFiltros: () => void;
  metricas: MetricasGenerales;
  loading: boolean;
  selectedDenunciaId: string | null;
  setSelectedDenunciaId: (id: string | null) => void;
  theme?: 'light' | 'dark';
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({
  denuncias,
  filtros,
  setFiltros,
  onResetFiltros,
  metricas,
  loading,
  selectedDenunciaId,
  setSelectedDenunciaId,
  theme = 'light',
}) => {
  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/40 dark:from-slate-900/60 dark:via-slate-950/40 dark:to-emerald-950/20 p-8 md:p-12 glass-panel shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" />
            Vigilancia Ambiental Participativa
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
            Reporte de Denuncias Ambientales
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            Portal interactivo público para el seguimiento de la calidad ecológica en Salaverry. Consulta denuncias registradas por los ciudadanos sobre calidad de aire, efluentes de agua, residuos y contaminación lumínica o acústica.
          </p>
        </div>
      </section>

      {/* Tarjeta de Métricas de Visualización Rápida */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total denuncias */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 glass-panel shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Denuncias Registradas</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? (
                <div className="h-7 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                metricas.total
              )}
            </h3>
          </div>
        </div>

        {/* Casos Activos (Pendiente + En Proceso) */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 glass-panel shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alertas Activas</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? (
                <div className="h-7 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                metricas.pendientes + metricas.enProceso
              )}
            </h3>
          </div>
        </div>

        {/* Total Coordenadas */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 glass-panel shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20">
            <MapPin size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Georreferenciadas</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? (
                <div className="h-7 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                denuncias.filter(d => d.latitud !== null && d.longitud !== null).length
              )}
            </h3>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <Filters filtros={filtros} setFiltros={setFiltros} onReset={onResetFiltros} theme={theme} />

      {/* Mapa y Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa Interactivo (Mayor ancho y visibilidad) */}
        <div className="lg:col-span-2 h-[500px] flex flex-col space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Distribución Geográfica de Denuncias
            </h3>
            {selectedDenunciaId && (
              <button
                onClick={() => setSelectedDenunciaId(null)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors font-semibold"
              >
                Limpiar Selección
              </button>
            )}
          </div>
          <div className="flex-grow shadow-md rounded-2xl border border-slate-200 dark:border-slate-800">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-900/40 rounded-2xl flex items-center justify-center animate-pulse border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-sm">Cargando mapa cartográfico...</span>
              </div>
            ) : (
              <Map
                denuncias={denuncias.filter(d => d.latitud !== null && d.longitud !== null)}
                selectedDenunciaId={selectedDenunciaId}
                onSelectDenuncia={setSelectedDenunciaId}
                theme={theme}
              />
            )}
          </div>
        </div>

        {/* Gráficos */}
        <div className="space-y-6">
          <GravityDonutChart data={metricas.porGravedad} loading={loading} theme={theme} />
          <TypesBarChart data={metricas.porTipo} loading={loading} theme={theme} />
        </div>
      </div>

      {/* Catálogo de Casos */}
      <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 glass-panel space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Flame size={18} className="text-amber-500" />
            Reportes Filtrados ({denuncias.length})
          </h3>
          <span className="text-xs text-slate-500">Salaverry, La Libertad</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse h-48" />
            ))}
          </div>
        ) : denuncias.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Ninguna denuncia coincide con los filtros aplicados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {denuncias.map(denuncia => {
              const gravityColors: Record<string, { badge: string; dot: string }> = {
                Alta: { badge: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
                Media: { badge: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
                Baja: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
              };
              const colors = gravityColors[denuncia.gravedad] || { badge: 'bg-slate-500/10 border-slate-500/20 text-slate-500', dot: 'bg-slate-400' };

              const stateColors: Record<string, string> = {
                Pendiente: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                'En Proceso': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                Resuelto: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                Desestimado: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
              };
              const stateBadge = stateColors[denuncia.estado] || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300';

              return (
                <div
                  key={denuncia.id}
                  onClick={() => {
                    if (denuncia.latitud && denuncia.longitud) {
                      setSelectedDenunciaId(denuncia.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                  }}
                  className={`group bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900/60 rounded-xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between h-full ${
                    selectedDenunciaId === denuncia.id
                      ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        {denuncia.tipo}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stateBadge}`}>
                        {denuncia.estado}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {denuncia.empresa || 'Presunto Infractor Desconocido'}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {denuncia.descripcion}
                    </p>

                    {denuncia.foto_url && (
                      <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                        <img
                          src={denuncia.foto_url}
                          alt="Evidencia"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                      Gravedad: {denuncia.gravedad}
                    </span>
                    <span>{new Date(denuncia.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
