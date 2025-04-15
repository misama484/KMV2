import React, { useState, useEffect } from 'react';
import BotonBuscar from '../components/BotonBuscar';

const TablaPacientes = ({ pacientes }) => {
  const [filteredPacientes, setFilteredPacientes] = useState(pacientes);

  const handleSearch = (searchTerm: string) => {
    const filtered = pacientes.filter((paciente) =>
      `${paciente.nombre} ${paciente.apellidos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredPacientes(filtered);
  };

  useEffect(() => {
    setFilteredPacientes(pacientes); // Actualiza la lista cuando cambien los pacientes
  }, [pacientes]);

  return (
    <div>
      <BotonBuscar
        placeholder="Buscar pacientes por nombre..."
        onSearch={handleSearch}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Apellidos</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Teléfono</th>
            <th className="border border-gray-300 px-4 py-2">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filteredPacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td className="border border-gray-300 px-4 py-2">{paciente.id}</td>
              <td className="border border-gray-300 px-4 py-2">{paciente.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{paciente.apellidos}</td>
              <td className="border border-gray-300 px-4 py-2">{paciente.email}</td>
              <td className="border border-gray-300 px-4 py-2">{paciente.telefono}</td>
              <td className="border border-gray-300 px-4 py-2">{paciente.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPacientes;