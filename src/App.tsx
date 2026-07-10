import { useState, useEffect, useMemo } from 'react';
import type { Denuncia, FiltrosDenuncia, MetricasGenerales } from './types';
import { denunciasService } from './services/denunciasService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Home } from './components/Home';
import { PublicDashboard } from './components/PublicDashboard';
import { AdminPanel } from './components/AdminPanel';
import { Leaf, Database, DatabaseZap, Sun, Moon } from 'lucide-react';

const INITIAL_FILTROS: FiltrosDenuncia = {
  tipo: '',
  estado: '',
  gravedad: '',
  fechaInicio: '',
  fechaFin: '',
  busqueda: '',
};

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'public' | 'admin'>('home');
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDenunciaId, setSelectedDenunciaId] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosDenuncia>(INITIAL_FILTROS);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sincronizar el tema con la etiqueta de documento HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Cargar denuncias iniciales
  const loadDenuncias = async () => {
    setLoading(true);
    try {
      const data = await denunciasService.getAll();
      setDenuncias(data);
      setIsConnected(isSupabaseConfigured());
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDenuncias();
  }, []);

  // Restablecer filtros
  const handleResetFiltros = () => {
    setFiltros(INITIAL_FILTROS);
  };

  // Filtrado de denuncias (para la vista del dashboard público)
  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter(denuncia => {
      // Filtro por tipo
      if (filtros.tipo && denuncia.tipo !== filtros.tipo) return false;
      // Filtro por estado
      if (filtros.estado && denuncia.estado !== filtros.estado) return false;
      // Filtro por gravedad
      if (filtros.gravedad && denuncia.gravedad !== filtros.gravedad) return false;

      // Filtro por rango de fechas
      if (filtros.fechaInicio) {
        const dateInicio = new Date(filtros.fechaInicio).getTime();
        const dateDenuncia = new Date(denuncia.created_at).getTime();
        if (dateDenuncia < dateInicio) return false;
      }
      if (filtros.fechaFin) {
        // Añadir 1 día al fin para incluir todo el día
        const dateFin = new Date(filtros.fechaFin).getTime() + 24 * 60 * 60 * 1000;
        const dateDenuncia = new Date(denuncia.created_at).getTime();
        if (dateDenuncia > dateFin) return false;
      }

      // Filtro por búsqueda de texto
      if (filtros.busqueda.trim()) {
        const text = filtros.busqueda.toLowerCase();
        const descMatch = denuncia.descripcion?.toLowerCase().includes(text);
        const empMatch = denuncia.empresa?.toLowerCase().includes(text);
        const dirMatch = denuncia.direccion?.toLowerCase().includes(text);
        if (!descMatch && !empMatch && !dirMatch) return false;
      }

      return true;
    });
  }, [denuncias, filtros]);

  // Cálculo de Métricas Generales (basado en el conjunto de datos completo o filtrado)
  const metricas = useMemo(() => {
    const defaultMetricas: MetricasGenerales = {
      total: 0,
      resueltas: 0,
      enProceso: 0,
      pendientes: 0,
      desestimadas: 0,
      porTipo: {},
      porGravedad: {},
    };

    return denuncias.reduce((acc, d) => {
      acc.total += 1;

      // Por estado
      if (d.estado === 'Resuelto') acc.resueltas += 1;
      else if (d.estado === 'En Proceso') acc.enProceso += 1;
      else if (d.estado === 'Pendiente') acc.pendientes += 1;
      else if (d.estado === 'Desestimado') acc.desestimadas += 1;

      // Por tipo
      acc.porTipo[d.tipo] = (acc.porTipo[d.tipo] || 0) + 1;

      // Por gravedad
      acc.porGravedad[d.gravedad] = (acc.porGravedad[d.gravedad] || 0) + 1;

      return acc;
    }, defaultMetricas);
  }, [denuncias]);



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Top Header Navigation with high z-index to stay above map */}
      <header className="sticky top-0 z-[1050] border-b border-slate-205 dark:border-slate-900 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300 shadow-sm">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 cursor-pointer" onClick={() => setActiveTab('home')}>
              <Leaf size={22} className="fill-emerald-500/10 dark:fill-emerald-400/20" />
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
              <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-1.5 leading-none">
                Salaverry Limpio
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Vigilancia Ambiental
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-md shadow-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'public'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-md shadow-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              Mapa y Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-md shadow-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <Database size={14} />
              Historial y Seguimiento
            </button>
          </nav>

          {/* Botones de Control y Tema */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
              title="Cambiar tema de color"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Supabase Connection Status Tag */}
            <div className="hidden md:flex items-center gap-2">
              {isConnected ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-full">
                  <DatabaseZap size={11} />
                  Supabase En Línea
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full" title="Corriendo con datos locales simulados">
                  <Database size={11} />
                  Modo Demo Local
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="flex-grow w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
        {activeTab === 'home' && (
          <Home onNavigate={setActiveTab} theme={theme} />
        )}
        {activeTab === 'public' && (
          <PublicDashboard
            denuncias={denunciasFiltradas}
            filtros={filtros}
            setFiltros={setFiltros}
            onResetFiltros={handleResetFiltros}
            metricas={metricas}
            loading={loading}
            selectedDenunciaId={selectedDenunciaId}
            setSelectedDenunciaId={setSelectedDenunciaId}
            theme={theme}
          />
        )}
        {activeTab === 'admin' && (
          <AdminPanel
            denuncias={denuncias}
            loading={loading}
            theme={theme}
          />
        )}
      </main>

      {/* Footer Area */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-450 dark:text-slate-550 transition-colors duration-300">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Municipalidad Distrital de Salaverry. Monitoreo Ambiental Participativo.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Políticas del Portal</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Ayuda Ciudadana</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
