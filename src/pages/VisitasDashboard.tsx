import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BotonBuscar from '../components/BotonBuscar';
import MenuDashboard from '../components/MenuDashboard';

interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  notas: string;
}

interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  cargo: string;
}

interface Visita {
  id: number;
  paciente: Paciente;
  trabajador: Trabajador;
  motivo: string;
  notas: string;
  fecha: string;
  hora: string;
}

const VisitasDashboard = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [visitasByPaciente, setVisitasByPaciente] = useState<Visita[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [filteredTrabajadores, setFilteredTrabajadores] = useState<Trabajador[]>([]);
  const [visitasByTrabajador, setVisitasByTrabajador] = useState<Visita[]>([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
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

    const fetchTrabajadores = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de trabajadores
        const trabajadoresRes = await axios.get('http://localhost:8080/trabajador/getAllTrabajadores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Trabajadores:', trabajadoresRes.data);
        setTrabajadores(trabajadoresRes.data);
        setFilteredTrabajadores(trabajadoresRes.data); // Inicializa la lista filtrada
      } catch (error: any) {
        console.error('Error al cargar los trabajadores:', error.response?.data || error.message);
        setError('Error al cargar los trabajadores. Por favor, inténtalo de nuevo.');
      }
    };

    fetchTrabajadores();

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

  const fetchVisitasByTrabajadorId = async (trabajadorId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log("TOKEN: " + token);

      // Solicita las visitas del trabajador por ID
      const visitasRes = await axios.get(`http://localhost:8080/visitas/trabajador/${trabajadorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisitasByTrabajador(visitasRes.data);

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

  const handleSearchTrabajador = (searchTerm: string) => {
    // Filtra la lista de trabajadores por nombre
    const filtered = trabajadores.filter((t) =>
      `${t.nombre} ${t.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrabajadores(filtered);
  };  

  const handleSelectPaciente = (paciente: Paciente) => {
    setSelectedPaciente(paciente); // Establece el paciente seleccionado
    setSelectedTrabajador(null); // Limpia el trabajador seleccionado
    fetchVisitasByPacienteId(paciente.id); // Solicita las visitas del paciente
  };

  const handleSelectTrabajador = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador); // Establece el trabajador seleccionado
    setSelectedPaciente(null); // Limpia el paciente seleccionado
    fetchVisitasByTrabajadorId(trabajador.id); // Solicita las visitas del trabajador
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Visitas</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />
      <div className="flex flex-row mb-4">
      {/* Campo de búsqueda Pacientes*/}
      <BotonBuscar
        placeholder="Buscar paciente por nombre..."
        onSearch={handleSearchPaciente}
      />
      {/* Campo de búsqueda Trabajadores*/}
      <BotonBuscar
        placeholder="Buscar trabajadores por nombre..."
        onSearch={handleSearchTrabajador}
      />
      </div>
      <div className='flex flex-row items-center'>
      {/* Desplegable de pacientes */}
      <div className="m-4 w-full">
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

      {/* Desplegable de trabajadores */}
      <div className="m-4 w-full">
        <h2 className="text-xl font-bold">Seleccionar Trabajador:</h2>
        <ul className="bg-primary border rounded-lg shadow-md max-h-40 overflow-y-auto">
          {filteredTrabajadores.map((trabajador) => (
            <li
              key={trabajador.id}
              onClick={() => handleSelectTrabajador(trabajador)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {`${trabajador.nombre} ${trabajador.apellidos}`}
            </li>
          ))}
          {filteredTrabajadores.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No se encontraron trabajadores</li>
          )}
        </ul>
      </div>
      </div>

      {/* Información del paciente seleccionado */}
      {selectedPaciente && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Paciente seleccionado:</h2>
          <p>{`${selectedPaciente.nombre} ${selectedPaciente.apellidos}`}</p>
        </div>
      )}

      {/* Información del trabajador seleccionado */}
      {selectedTrabajador && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Trabajador seleccionado:</h2>
          <p>{`${selectedTrabajador.nombre} ${selectedTrabajador.apellidos}`}</p>
        </div>
      )}

      {/* Tabla de visitas */}
      <div className="bg-primary shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Lista de Visitas</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">
                {selectedPaciente ? 'Trabajador' : 'Paciente'}
              </th>
              <th className="border border-gray-300 px-4 py-2">Motivo</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {selectedPaciente &&
              visitasByPaciente.map((visita) => (
                <tr key={visita.id}>
                  <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visita.trabajador.nombre + ' ' + visita.trabajador.apellidos}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
                </tr>
              ))}

            {selectedTrabajador &&
              visitasByTrabajador.map((visita) => (
                <tr key={visita.id}>
                  <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visita.paciente.nombre + ' ' + visita.paciente.apellidos}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                  <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Mensaje si no hay visitas */}
        {selectedPaciente && visitasByPaciente.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No se encontraron visitas para este paciente.
          </p>
        )}
        {selectedTrabajador && visitasByTrabajador.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No se encontraron visitas para este trabajador.
          </p>
        )}
      </div>
    </div>
  );
};

export default VisitasDashboard;