import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BotonBuscar from '../components/BotonBuscar';
import MenuDashboard from '../components/MenuDashboard';
import MenuOptionsDashboard from '../components/MenuOptionsDashboard';
import AgregarTrabajadorModal from '../modal/AgregarTrabajadorModal';
import EditarTrabajadorModal from '../modal/EditarTrabajadorModal';

interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  cargo: string;
  email: string;
  telefono: string;
  notas: string;
}


const TrabajadoresDashboard = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]); // Lista de trabajadores para buscar por nombre
  const [filteredTrabajadores, setFilteredTrabajadores] = useState<Trabajador[]>([]); // Lista filtrada de trabajadores
  const [visitasByTrabajador, setVisitasByTrabajador] = useState([]); // Visitas del trabajador seleccionado
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null> (null); // Trabajador seleccionado
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura del modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la apertura del modal de edición
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar la apertura del modal de eliminación

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de trabajadores
        const trabajadoresRes = await axios.get('http://localhost:8080/trabajador/getAllActiveTrabajadores', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrabajadores(trabajadoresRes.data);
        setFilteredTrabajadores(trabajadoresRes.data); // Inicializa la lista filtrada
      } catch (error: any) {
        console.error('Error al cargar los trabajadores:', error.response?.data || error.message);
        setError('Error al cargar los trabajadores. Por favor, inténtalo de nuevo.');
      }
    };

    fetchTrabajadores();
  }, []);

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

  const handleSearchTrabajador = (searchTerm: string) => {
    // Filtra la lista de trabajadores por nombre
    const filtered = trabajadores.filter((t) =>
      `${t.nombre} ${t.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrabajadores(filtered);
  };

  const handleSelectTrabajador = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador); // Establece el trabajador seleccionado
    fetchVisitasByTrabajadorId(trabajador.id); // Solicita las visitas del trabajador
  };

  const handleTrabajadorAdded = () => {
    // Actualiza la lista de pacientes después de agregar uno nuevo
    const fetchTrabajadores = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log("TOKEN: " + token);

        // Solicita la lista de trabajadores
        const trabajadoresRes = await axios.get('http://localhost:8080/trabajador/getAllActiveTrabajadores', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrabajadores(trabajadoresRes.data);
        setFilteredTrabajadores(trabajadoresRes.data); // Inicializa la lista filtrada
      } catch (error: any) {
        console.error('Error al cargar los trabajadores:', error.response?.data || error.message);
        setError('Error al cargar los trabajadores. Por favor, inténtalo de nuevo.');
      }

    fetchTrabajadores();
  }
}

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Trabajadores</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />

      {/* Campo de búsqueda */}
      <div className='flex space-x-3'>
        <BotonBuscar
          placeholder="Buscar trabajador por nombre..."
          onSearch={handleSearchTrabajador}
        />
        <button 
            onClick={() => setModalOpen(true)} // Abre el modal al hacer clic
            className="bg-primary hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
            Añadir Trabajador
        </button>
      </div>

      {/* Desplegable de trabajadores */}
      <div className="mb-4">
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

      {/* Información del trabajador seleccionado */}
{selectedTrabajador && (
  <div className="bg-primary shadow-md rounded-lg p-6 mb-4">
    <div className='flex justify-between items-center mx-4'>
      <h2 className="text-xl font-bold mb-4">Trabajador seleccionado:</h2>
      <MenuOptionsDashboard editar={() => setIsEditModalOpen(true)} eliminar={() => setIsDeleteModalOpen(true)}/>
    </div>
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <tbody>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Nombre:</td>
          <td className="border border-gray-300 px-4 py-2">{`${selectedTrabajador.nombre} ${selectedTrabajador.apellidos}`}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Cargo:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedTrabajador.cargo}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Email:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedTrabajador.email}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Teléfono:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedTrabajador.telefono}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold">Notas:</td>
          <td className="border border-gray-300 px-4 py-2">{selectedTrabajador.notas}</td>
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
              <th className="border border-gray-300 px-4 py-2">Paciente</th>
              <th className="border border-gray-300 px-4 py-2">Motivo</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {visitasByTrabajador.map((visita) => (
              <tr key={visita.id}>
                <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.paciente.nombre + ' ' + visita.paciente.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visitasByTrabajador.length === 0 && selectedTrabajador && (
          <p className="text-center text-gray-500 mt-4">No se encontraron visitas para este trabajador.</p>
        )}
      </div>

      {/* Modal para añadir trabajador */}
      <AgregarTrabajadorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onTrabajadorAdded={handleTrabajadorAdded}
      />

      {/* Modal para editar trabajador */}
      <EditarTrabajadorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          trabajador={selectedTrabajador}
          onTrabajadorUpdated={handleTrabajadorAdded} // Actualiza la lista de trabajadores después de editar
      />

      {/* Modal para eliminar trabajador */}

    </div>
  );
};

export default TrabajadoresDashboard;