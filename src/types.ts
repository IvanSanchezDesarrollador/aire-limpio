export interface Denuncia {
  id: string;
  tipo: 'Aire' | 'Agua' | 'Suelos' | 'Residuos' | 'Lumínica' | 'Acústica' | 'Otro' | string;
  empresa: string | null;
  descripcion: string;
  gravedad: 'Baja' | 'Media' | 'Alta';
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
  foto_url: string | null;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Desestimado' | string;
  created_at: string;
}

export interface FiltrosDenuncia {
  tipo: string;
  estado: string;
  gravedad: string;
  fechaInicio: string;
  fechaFin: string;
  busqueda: string;
}

export interface MetricasGenerales {
  total: number;
  resueltas: number;
  enProceso: number;
  pendientes: number;
  desestimadas: number;
  porTipo: Record<string, number>;
  porGravedad: Record<string, number>;
}
