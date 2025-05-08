import React, { useState, useEffect } from 'react';
import BotonBuscar from '../components/BotonBuscar';

const TablaVisitas = ({ visitas }) => {
  const [filteredVisitas, setFilteredVisitas] = useState(visitas);

  const handleSearch = (searchTerm: string) => {
    const filtered = visitas.filter((visita) =>
      `${visita.motivo} ${visita.paciente.nombre} ${visita.paciente.apellidos} ${visita.trabajador.nombre} ${visita.trabajador.apellidos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredVisitas(filtered);
  };

  useEffect(() => {
    setFilteredVisitas(visitas); // Actualiza la lista cuando cambien los trabajadores
  }, [visitas]);

  return (
    <div>
      <BotonBuscar
        placeholder="Buscar visitas por nombre..."
        onSearch={handleSearch}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
              <th className="border border-gray-300 px-4 py-2">Nombre paciente</th>
              <th className="border border-gray-300 px-4 py-2">Nombre trabajador</th>
              <th className="border border-gray-300 px-4 py-2">Motivo</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((visita) => (
              <tr key={visita.id}>
                <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.paciente.nombre + ' ' + visita.paciente.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.trabajador.nombre + ' ' + visita.trabajador.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                
                
                
                
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default TablaVisitas;
