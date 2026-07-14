import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Denuncia } from '../types';

interface MapProps {
  denuncias: Denuncia[];
  selectedDenunciaId?: string | null;
  onSelectDenuncia?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  theme?: 'light' | 'dark';
}

export const Map: React.FC<MapProps> = ({
  denuncias,
  selectedDenunciaId,
  onSelectDenuncia,
  center = [-8.1119, -79.0287], // Plaza de Armas de Trujillo
  zoom = 11,
  interactive = true,
  theme = 'light',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Colores según gravedad
  const gravityColors: Record<string, string> = {
    Alta: '#ef4444', // Red
    Media: '#f59e0b', // Amber
    Baja: '#10b981', // Emerald
  };

  const getTileUrl = (t: 'light' | 'dark') => {
    return t === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inicializar mapa si no existe
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        scrollWheelZoom: interactive,
        dragging: interactive,
      });

      // Capa de mapa (dinámica según tema)
      tileLayerRef.current = L.tileLayer(getTileUrl(theme), {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapRef.current);
    } else {
      // Si el centro o zoom cambian
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom, interactive]);

  // Actualizar URL de capa cuando cambia el tema
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(getTileUrl(theme));
    }
  }, [theme]);

  // Sincronizar marcadores cuando cambien las denuncias o la selección
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Eliminar marcadores viejos que ya no están en la lista
    const currentIds = new Set(denuncias.map(d => d.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Agregar o actualizar marcadores
    denuncias.forEach(denuncia => {
      if (denuncia.latitud === null || denuncia.longitud === null) return;

      const lat = denuncia.latitud;
      const lng = denuncia.longitud;
      const color = gravityColors[denuncia.gravedad] || '#10b981';
      const isSelected = selectedDenunciaId === denuncia.id;

      // Crear icono personalizado tipo pin brillante
      const iconSize = isSelected ? 36 : 28;
      const customIcon = L.divIcon({
        html: `
          <div class="custom-marker-pin" style="
            width: ${iconSize}px;
            height: ${iconSize}px;
            background-color: ${color};
            border: 2px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: ${iconSize / 3}px;
              height: ${iconSize / 3}px;
              background-color: #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: '',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
      });

      if (markersRef.current[denuncia.id]) {
        // Actualizar posición e icono
        const marker = markersRef.current[denuncia.id];
        marker.setLatLng([lat, lng]);
        marker.setIcon(customIcon);
      } else {
        // Crear nuevo marcador
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Popup HTML estético
        const popupContent = `
          <div style="font-family: 'Outfit', sans-serif; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                background-color: ${color}20;
                color: ${color};
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid ${color}30;
              ">${denuncia.tipo}</span>
              <span style="font-size: 10px; color: #94a3b8;">${new Date(denuncia.created_at).toLocaleDateString()}</span>
            </div>
            <h5 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #ffffff;">
              ${denuncia.empresa || 'Responsable Desconocido'}
            </h5>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #cbd5e1; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${denuncia.descripcion}
            </p>
            ${
              denuncia.foto_url
                ? `<div style="width: 100%; height: 80px; overflow: hidden; border-radius: 6px; margin-bottom: 8px;">
                     <img src="${denuncia.foto_url}" style="width: 100%; height: 100%; object-fit: cover;" />
                   </div>`
                : ''
            }
            <div style="font-size: 11px; display: flex; justify-content: space-between; color: #94a3b8;">
              <span>Gravedad: <strong style="color: ${color};">${denuncia.gravedad}</strong></span>
              <span style="
                color: ${
                  denuncia.estado === 'Resuelto'
                    ? '#10b981'
                    : denuncia.estado === 'En Proceso'
                    ? '#3b82f6'
                    : denuncia.estado === 'Desestimado'
                    ? '#64748b'
                    : '#f59e0b'
                }
              ">${denuncia.estado}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -10],
        });

        if (onSelectDenuncia) {
          marker.on('click', () => {
            onSelectDenuncia(denuncia.id);
          });
        }

        markersRef.current[denuncia.id] = marker;
      }

      // Si este es el seleccionado y la vista es interactiva, abrir popup y enfocar
      if (isSelected && interactive) {
        const marker = markersRef.current[denuncia.id];
        setTimeout(() => {
          marker.openPopup();
          map.setView([lat, lng], 15, { animate: true });
        }, 100);
      }
    });
  }, [denuncias, selectedDenunciaId, interactive]);

  // Limpiar mapa al desmontar el componente
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '300px' }} />
    </div>
  );
};
