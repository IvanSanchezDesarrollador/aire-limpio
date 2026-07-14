import React, { useState, useMemo } from 'react';
import type { Denuncia } from '../types';
import { Map } from './Map';
import {
  Search,
  Eye,
  Calendar,
  Building2,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';

interface AdminPanelProps {
  denuncias: Denuncia[];
  loading: boolean;
  theme?: 'light' | 'dark';
}

type SortField = 'created_at' | 'gravedad' | 'estado' | 'tipo' | 'empresa';
type SortOrder = 'asc' | 'desc';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  denuncias,
  loading,
  theme = 'light',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Detalle de la denuncia activa
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Filtrado y Ordenación
  const filteredAndSortedDenuncias = useMemo(() => {
    let result = [...denuncias];

    // Búsqueda global por texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        d =>
          (d.descripcion && d.descripcion.toLowerCase().includes(term)) ||
          (d.empresa && d.empresa.toLowerCase().includes(term)) ||
          (d.direccion && d.direccion.toLowerCase().includes(term)) ||
          (d.tipo && d.tipo.toLowerCase().includes(term))
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let valA: string = a[sortField] || '';
      let valB: string = b[sortField] || '';

      // Si es fecha
      if (sortField === 'created_at') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Orden estándar de strings
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    return result;
  }, [denuncias, searchTerm, sortField, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedDenuncias.length / itemsPerPage);
  const paginatedDenuncias = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedDenuncias.slice(start, start + itemsPerPage);
  }, [filteredAndSortedDenuncias, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Colores de las gravedades
  const gravityBadge = (gravedad: string) => {
    const badges: Record<string, string> = {
      Alta: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400',
      Media: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
      Baja: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    };
    return badges[gravedad] || 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
  };

  return (
    <div className="space-y-6 relative min-h-[600px] w-full max-w-full">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Buscador y Historial de Casos</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inspecciona los reportes ambientales registrados, visualiza la ubicación en el mapa e interactúa con el estado de fiscalización.</p>
        </div>

        {/* Buscador global */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por infractor, dirección..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-450 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden glass-panel shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/20" onClick={() => handleSort('tipo')}>
                  Tipo {sortField === 'tipo' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/20" onClick={() => handleSort('empresa')}>
                  Presunto Responsable {sortField === 'empresa' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-5">Descripción</th>
                <th className="py-4 px-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/20" onClick={() => handleSort('gravedad')}>
                  Gravedad {sortField === 'gravedad' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/20" onClick={() => handleSort('created_at')}>
                  Fecha {sortField === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm text-slate-600 dark:text-slate-300">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-52 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-5 text-right"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 ml-auto rounded" /></td>
                  </tr>
                ))
              ) : paginatedDenuncias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    No se encontraron denuncias registradas en Salaverry.
                  </td>
                </tr>
              ) : (
                paginatedDenuncias.map(denuncia => (
                  <tr
                    key={denuncia.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group ${
                      selectedDenuncia?.id === denuncia.id ? 'bg-slate-100/50 dark:bg-slate-800/30' : ''
                    }`}
                    onClick={() => setSelectedDenuncia(denuncia)}
                  >
                    <td className="py-4 px-5 font-semibold text-slate-800 dark:text-slate-100">{denuncia.tipo}</td>
                    <td className="py-4 px-5 truncate max-w-[180px]">
                      {denuncia.empresa || <span className="text-slate-400 dark:text-slate-500 italic">No especificada</span>}
                    </td>
                    <td className="py-4 px-5 max-w-xs truncate">{denuncia.descripcion}</td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-xs border font-bold ${gravityBadge(denuncia.gravedad)}`}>
                        {denuncia.gravedad}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-500 dark:text-slate-400">
                      {new Date(denuncia.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDenuncia(denuncia)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent transition-all"
                        title="Ver Detalles"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-550 dark:text-slate-500 font-medium">
              Página {currentPage} de {totalPages} ({filteredAndSortedDenuncias.length} registros)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel Desplizable Lateral de Detalle de Denuncia */}
      {selectedDenuncia && (
        <>
          {/* Fondo traslúcido para bloquear clics en otros lados */}
          <div
            className="fixed inset-0 bg-slate-950/50 dark:bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedDenuncia(null)}
          />

          {/* Panel Lateral */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[600px] md:w-[700px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800/80 shadow-2xl z-50 flex flex-col justify-between overflow-hidden transition-transform duration-300 transform translate-x-0">
            {/* Header del Panel */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
              <div className="space-y-1">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${gravityBadge(selectedDenuncia.gravedad)}`}>
                  {selectedDenuncia.tipo}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">Detalle de Reporte</h3>
              </div>
              <button
                onClick={() => setSelectedDenuncia(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido del Panel */}
            <div className="flex-grow p-6 overflow-y-scroll space-y-6">
              {/* Empresa Responsable */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={12} />
                  Infractor / Empresa Relacionada
                </span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {selectedDenuncia.empresa || 'Empresa o infractor no reportado'}
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={12} />
                  Descripción del Suceso
                </span>
                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans whitespace-pre-line">
                  {selectedDenuncia.descripcion}
                </p>
              </div>

              {/* Ubicación y Dirección */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} />
                  Dirección o Referencia
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {selectedDenuncia.direccion || 'Dirección no ingresada'}
                </p>

                {/* Mapa con la ubicación exacta */}
                {selectedDenuncia.latitud && selectedDenuncia.longitud ? (
                  <div className="w-full h-[30rem] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-inner">
                    <Map
                      denuncias={[selectedDenuncia]}
                      selectedDenunciaId={selectedDenuncia.id}
                      center={[selectedDenuncia.latitud, selectedDenuncia.longitud]}
                      zoom={16}
                      interactive={true}
                      theme={theme}
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs italic">
                    Este reporte no cuenta con georreferenciación.
                  </div>
                )}
              </div>

              {/* Imagen / Evidencia */}
              {selectedDenuncia.foto_url && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    Evidencia Fotográfica
                  </span>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 group">
                    <img
                      src={selectedDenuncia.foto_url}
                      alt="Evidencia"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setIsFullscreenImage(true)}
                      className="absolute bottom-3 right-3 p-2 bg-slate-950/80 hover:bg-emerald-600 hover:text-white text-slate-200 rounded-lg backdrop-blur border border-slate-800 hover:border-transparent transition-all flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Maximize2 size={13} />
                      Ampliar Imagen
                    </button>
                  </div>
                </div>
              )}

              {/* Fecha de Registro */}
              <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-900">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Fecha de creación:
                </span>
                <span>{new Date(selectedDenuncia.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Pantalla Completa para la Imagen */}
      {isFullscreenImage && selectedDenuncia?.foto_url && (
        <div
          className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 transition-opacity"
          onClick={() => setIsFullscreenImage(false)}
        >
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-5 right-5 p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <img
            src={selectedDenuncia.foto_url}
            alt="Evidencia Ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          />
        </div>
      )}
    </div>
  );
};
