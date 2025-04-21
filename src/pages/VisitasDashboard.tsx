import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BotonBuscar from '../components/BotonBuscar';
import MenuDashboard from '../components/MenuDashboard';

const VisitasDashboard = () => {
  const [pacientes, setPacientes] = useState([]); // Lista de pacientes para buscar por nombre
  const [filteredPacientes, setFilteredPacientes] = useState([]); // Lista filtrada de pacientes
  const [visitasByPaciente, setVisitasByPaciente] = useState([]); // Visitas del paciente seleccionado
  const [selectedPaciente, setSelectedPaciente] = useState(null); // Paciente seleccionado
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de pacientes
        const pacientesRes = await axios.get('http://localhost:8080/paciente/getAllPacientes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPacientes(pacientesRes.data);
        setFilteredPacientes(pacientesRes.data); // Inicializa la lista filtrada
      } catch (error: any) {
        console.error('Error al cargar los pacientes:', error.response?.data || error.message);
        setError('Error al cargar los pacientes. Por favor, inténtalo de nuevo.');
      }
    };

    fetchPacientes();
  }, []);

  const fetchVisitasByPacienteId = async (pacienteId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log("TOKEN: " + token);

      // Solicita las visitas del paciente por ID
      const visitasRes = await axios.get(`http://localhost:8080/visitas/paciente/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisitasByPaciente(visitasRes.data);
      
    } catch (error: any) {
      console.error('Error al cargar las visitas:', error.response?.data || error.message);
      setError('Error al cargar las visitas. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSearchPaciente = (searchTerm: string) => {
    // Filtra la lista de pacientes por nombre
    const filtered = pacientes.filter((p) =>
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPacientes(filtered);
  };

  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente); // Establece el paciente seleccionado
    fetchVisitasByPacienteId(paciente.id); // Solicita las visitas del paciente
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Visitas por Paciente</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />

      {/* Campo de búsqueda */}
      <BotonBuscar
        placeholder="Buscar paciente por nombre..."
        onSearch={handleSearchPaciente}
      />

      {/* Desplegable de pacientes */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Seleccionar Paciente:</h2>
        <ul className="bg-primary border rounded-lg shadow-md max-h-40 overflow-y-auto">
          {filteredPacientes.map((paciente) => (
            <li
              key={paciente.id}
              onClick={() => handleSelectPaciente(paciente)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {`${paciente.nombre} ${paciente.apellidos}`}
            </li>
          ))}
          {filteredPacientes.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No se encontraron pacientes</li>
          )}
        </ul>
      </div>

      {/* Información del paciente seleccionado */}
      {selectedPaciente && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Paciente seleccionado:</h2>
          <p>{`${selectedPaciente.nombre} ${selectedPaciente.apellidos}`}</p>
        </div>
      )}

      {/* Tabla de visitas */}
      <div className="bg-primary shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Lista de Visitas</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Trabajador</th>
              <th className="border border-gray-300 px-4 py-2">Motivo</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {visitasByPaciente.map((visita) => (
              <tr key={visita.id}>
                <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.trabajador.nombre + ' ' + visita.trabajador.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visitasByPaciente.length === 0 && selectedPaciente && (
          <p className="text-center text-gray-500 mt-4">No se encontraron visitas para este paciente.</p>
        )}
      </div>
    </div>
  );
};

export default VisitasDashboard;