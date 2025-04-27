import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BotonBuscar from '../components/BotonBuscar';
import MenuDashboard from '../components/MenuDashboard';
import MenuOptionsDashboard from '../components/MenuOptionsDashboard';
import ModalAgregarPaciente from '../modal/ModalAgregarPaciente';
import EditarPacienteModal from '../modal/EditarPacienteModal';
import EliminarPacienteModal from '../modal/EliminarPacienteModal';

interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  direccion: string;
  email: string;
  telefono: string;
  notas?: string; // Opcional
}

const PacientesDashboard = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]); // Lista filtrada de pacientes
  const [visitasByPaciente, setVisitasByPaciente] = useState([]); // Visitas del paciente seleccionado
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);// Paciente seleccionado
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura del modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la apertura del modal de edición
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar la apertura del modal de eliminación



  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de trabajadores
        const pacientesRes = await axios.get('http://localhost:8080/paciente/getAllActivePacientes', {
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

  const handleSelectPaciente = (paciente: Paciente) => {
    setSelectedPaciente(paciente); // Establece el paciente seleccionado
    fetchVisitasByPacienteId(paciente.id); // Solicita las visitas del paciente
  };

  const handlePacienteAdded = () => {
    // Actualiza la lista de pacientes después de agregar uno nuevo
    const fetchPacientes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de pacientes
        const pacientesRes = await axios.get('http://localhost:8080/paciente/getAllActivePacientes', {
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
  }


  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pacientes</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />
      

      {/* Campo de búsqueda y boton agregar */}
      <div className="flex space-x-3">
        <BotonBuscar        
          placeholder="Buscar paciente por nombre..."
          onSearch={handleSearchPaciente}
        />      
        <button 
          onClick={() => setModalOpen(true)} // Abre el modal al hacer clic
          className="bg-primary hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
          Añadir Paciente
        </button>
      </div>
      {/* Desplegable de Pacientes */}
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
  <div className="bg-primary shadow-md rounded-lg p-6 mb-4 ">
    <div className="flex justify-between mx-4 items-center ">
      <h2 className="text-xl font-bold mb-4">Paciente seleccionado:</h2>
      <MenuOptionsDashboard editar={() => setIsEditModalOpen(true)} eliminar={() => setIsDeleteModalOpen(true)}/>
    </div>
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <tbody>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">ID:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedPaciente.id}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Nombre:</td>
          <td className="border border-gray-300 px-4 py-2">{`${selectedPaciente.nombre} ${selectedPaciente.apellidos}`}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Direccion:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedPaciente.direccion}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Email:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedPaciente.email}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Teléfono:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedPaciente.telefono}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Notas:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedPaciente.notas}</td>
        </tr>
      </tbody>
    </table>
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
        
        {/* Modal para agregar paciente */}
        <ModalAgregarPaciente
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onPacienteAdded={handlePacienteAdded}
        />

        {/* Modal para editar paciente */}
        <EditarPacienteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          paciente={selectedPaciente}
          onPacienteUpdated={handlePacienteAdded}
        />

        {/* Modal para eliminar paciente */}
        <EliminarPacienteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          paciente={selectedPaciente}
          onPacienteUpdated={handlePacienteAdded}
        />
    </div>

    
  );
};

export default PacientesDashboard;