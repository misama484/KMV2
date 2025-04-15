import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuDashboard from '../components/MenuDashboard';
import TablaPacientes from '../components/TablaPacientes';
import TablaTrabajadores from '../components/TablaTrabajadores';

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

      {/* Botón de cerrar sesión */}
        

      {/* Tabla de Pacientes */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
        <TablaPacientes pacientes={pacientes} />
      </div>
      
      {/*<div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Apellidos</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Teléfono</th>
              <th className="border border-gray-300 px-4 py-2">Dirección</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id}>
                <td className="border border-gray-300 px-4 py-2">{paciente.id}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.email}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.telefono}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.direccion}</td>
                <td className="border border-gray-300 px-4 py-2">{paciente.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>/*}

      {/* Tabla de Trabajadores */}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Lista de Trabajadores</h2>
        <TablaTrabajadores trabajadores={trabajadores} />
      </div>

      {/*<div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Lista de Trabajadores</h2>
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
            {trabajadores.map((trabajador) => (
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
      </div>*/}

      {/* Tabla de Visitas */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Lista de Visitas</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Motivo</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
              <th className="border border-gray-300 px-4 py-2">Nombre paciente</th>
              <th className="border border-gray-300 px-4 py-2">Nombre trabajador</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((visita) => (
              <tr key={visita.id}>
                <td className="border border-gray-300 px-4 py-2">{visita.id}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.motivo}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.notas || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.paciente.nombre + ' ' + visita.paciente.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.trabajador.nombre + ' ' + visita.trabajador.apellidos}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.fecha}</td>
                <td className="border border-gray-300 px-4 py-2">{visita.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;