import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuDashboard from '../components/MenuDashboard';
import TablaPacientes from '../components/TablaPacientes';
import TablaTrabajadores from '../components/TablaTrabajadores';
import TablaVisitas from '../components/TablaVisitas';
import CalendarioDashboard from '../components/CalendarioDashboard';

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
  fecha: string;
  hora: string;
  paciente_id: number;
  trabajador_id: number;
  notas: string;
}

const Dashboard = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Estado para la fecha seleccionada

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const token = sessionStorage.getItem('token'); // Obtén el token de sessionStorage      
        //console.log("TOKEN: " + token); // Verifica si el token se obtiene correctamente
        //console.log(`Authorization: Bearer ${token}`); // Verifica el encabezado

        // Solicitudes a los endpoints
        const [pacientesRes, trabajadoresRes, visitasRes] = await Promise.all([
          axios.get('http://localhost:8080/paciente/getAllActivePacientes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/trabajador/getAllTrabajadores', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/visitas/getAllVisitas', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('Pacientes:', pacientesRes.data);
        console.log('Trabajadores:', trabajadoresRes.data);
        console.log('Visitas:', visitasRes.data);

        const pacientesDict = Object.fromEntries(
          pacientesRes.data.map((paciente: Paciente) => [paciente.id, `${paciente.nombre} ${paciente.apellidos}`])
        );

        const trabajadoresDict = Object.fromEntries(
          trabajadoresRes.data.map((trabajador: Trabajador) => [trabajador.id, `${trabajador.nombre} ${trabajador.apellidos}`])
        );

        const visitasConNombres = visitasRes.data.map((visita: Visita) => ({
          ...visita,
          pacienteNombre: pacientesDict[visita.paciente_id] || 'Desconocido',
          trabajadorNombre: trabajadoresDict[visita.trabajador_id] || 'Desconocido',
        }));

        console.log('Visitas con nombres:', visitasConNombres);

        setPacientes(pacientesRes.data);
        setTrabajadores(trabajadoresRes.data);
        setVisitas(visitasConNombres);
      } catch (err: any) {
        console.error('Error:', err.response?.data || err.message);
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date); // Actualiza el día seleccionado
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />      

      {/* Calendario  */}
      <CalendarioDashboard onDateChange={handleDateChange} pacientes={pacientes} trabajadores={trabajadores} visitas={visitas} />

      {/* Sección de estadísticas */}
      <div className="bg-primary shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
        <p className="text-lg mb-2">Total de Pacientes: {pacientes.length}</p>
        <p className="text-lg mb-2">Total de Trabajadores: {trabajadores.length}</p>
        <p className="text-lg mb-2">Total de Visitas: {visitas.length}</p>
      </div>  

      {/* Tabla de Pacientes */}
      <div className="bg-primary shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
        <TablaPacientes pacientes={pacientes} />
      </div>      
      
      {/* Tabla de Trabajadores */}

      <div className="bg-primary shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Lista de Trabajadores</h2>
        <TablaTrabajadores trabajadores={trabajadores} />
      </div>

      {/* Tabla de Visitas */}

      <div className="bg-primary shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Lista de Visitas</h2>
        <TablaVisitas visitas={visitas} />
      </div>
    </div>
  );
};

export default Dashboard;