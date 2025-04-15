import React, { useState, useEffect } from 'react';
import BotonBuscar from '../components/BotonBuscar';

const TablaTrabajadores = ({ trabajadores }) => {
  const [filteredTrabajadores, setFilteredTrabajadores] = useState(trabajadores);

  const handleSearch = (searchTerm: string) => {
    const filtered = trabajadores.filter((trabajador) =>
      `${trabajador.nombre} ${trabajador.apellidos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredTrabajadores(filtered);
  };

  useEffect(() => {
    setFilteredTrabajadores(trabajadores); // Actualiza la lista cuando cambien los trabajadores
  }, [trabajadores]);

  return (
    <div>
      <BotonBuscar
        placeholder="Buscar trabajadores por nombre..."
        onSearch={handleSearch}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Apellidos</th>
            <th className="border border-gray-300 px-4 py-2">Cargo</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Teléfono</th>
            <th className="border border-gray-300 px-4 py-2">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrabajadores.map((trabajador) => (
            <tr key={trabajador.id}>
              <td className="border border-gray-300 px-4 py-2">{trabajador.id}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.apellidos}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.cargo}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.email}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.telefono}</td>
              <td className="border border-gray-300 px-4 py-2">{trabajador.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaTrabajadores;