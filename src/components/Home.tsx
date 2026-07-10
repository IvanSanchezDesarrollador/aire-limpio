import React from 'react';
import { Leaf, MapPin, Eye, Users, ChevronRight, BarChart3, Database } from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: 'public' | 'admin') => void;
  theme?: 'light' | 'dark';
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-500 w-full max-w-full">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
          <Leaf size={32} className="fill-emerald-500/10 dark:fill-emerald-400/20" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-850 dark:text-white leading-none">
          Portal de Vigilancia Ambiental <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Salaverry Limpio
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Una plataforma comunitaria para la fiscalización, reporte y transparencia de la calidad del aire, agua, suelos y ecosistemas en el distrito de Salaverry.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('public')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 group cursor-pointer text-base"
          >
            Explorar Mapa y Reportes
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer text-base shadow-sm"
          >
            <Database size={16} />
            Consultar Historial
          </button>
        </div>
      </section>

      {/* Grid de Propósitos e Impacto */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl glass-panel space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <MapPin size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Georreferenciación</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mapeo preciso en tiempo real de cada reporte ciudadano en el distrito. Localiza focos de contaminación y visualiza patrones espaciales de emisiones industriales o residuos.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl glass-panel space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-450 border border-teal-500/20">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Análisis Estadístico</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Gráficos interactivos de barra y dona que clasifican los incidentes según el tipo de contaminación (aire, agua, lumínica) y nivel de gravedad reportado por la comunidad.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl glass-panel space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Users size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Participación Cívica</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Fomenta la fiscalización ambiental comunitaria. Permite a los habitantes de Salaverry registrar evidencias fotográficas y geográficas para alertar de actividades nocivas.
            </p>
          </div>
        </div>
      </section>

      {/* Propósito y Detalle de Beneficios */}
      <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 glass-panel shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">
              ¿Por qué es importante vigilar el ambiente en Salaverry?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Salaverry alberga un importante puerto y áreas industriales que conviven con zonas residenciales y playas turísticas. La proximidad de almacenes de minerales, pesqueras y de carga pesada genera desafíos únicos para el bienestar ecológico del distrito.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
                  <Eye size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-205 text-sm">Transparencia Total</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acceso libre de cualquier persona al historial detallado de incidentes reportados.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
                  <Leaf size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-205 text-sm">Preservación de Ecosistemas</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Alertas y mapeo preventivo para proteger las playas y áreas protegidas locales.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-6 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <Leaf size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Salaverry Sostenible</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm">
              "El aire limpio no es un privilegio, es una necesidad y un derecho fundamental para todas las familias de nuestro puerto."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
