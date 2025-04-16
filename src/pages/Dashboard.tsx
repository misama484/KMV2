import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuDashboard from '../components/MenuDashboard';
import TablaPacientes from '../components/TablaPacientes';
import TablaTrabajadores from '../components/TablaTrabajadores';
import TablaVisitas from '../components/TablaVisitas';

const Dashboard = () => {
  const [pacientes, setPacientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const token = sessionStorage.getItem('token'); // Obtén el token de sessionStorage
        /*const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuLnBlcmV6QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NzA3MzA1LCJleHAiOjE3NDQ3OTM3MDV9.yB15PauVqa68YTa6PexEgJFyIg82FRcxFGu7fX-qG-Q"*/
        console.log("TOKEN: " + token); // Verifica si el token se obtiene correctamente
        console.log(`Authorization: Bearer ${token}`); // Verifica el encabezado

        // Solicitudes a los endpoints
        const [pacientesRes, trabajadoresRes, visitasRes] = await Promise.all([
          axios.get('http://localhost:8080/paciente/getAllPacientes', {
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
          pacientesRes.data.map((paciente) => [paciente.id, `${paciente.nombre} ${paciente.apellidos}`])
        );

        const trabajadoresDict = Object.fromEntries(
          trabajadoresRes.data.map((trabajador) => [trabajador.id, `${trabajador.nombre} ${trabajador.apellidos}`])
        );

        const visitasConNombres = visitasRes.data.map((visita) => ({
          ...visita,
          pacienteNombre: pacientesDict[visita.paciente_id] || 'Desconocido',
          trabajadorNombre: trabajadoresDict[visita.trabajador_id] || 'Desconocido',
        }));

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

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <MenuDashboard />       

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