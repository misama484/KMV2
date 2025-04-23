import React from 'react';

const MenuDashboard = () => {
  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Elimina el token de sessionStorage
    window.location.href = '/login'; // Redirige al usuario a la página de login
  };

  return (
    <div className="bg-primary rounded-xl text-white shadow-md mb-8">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu</h1>
        <nav className="flex space-x-4">
        <a
            href="/Dashboard"
            className="hover:bg-background px-3 py-2 rounded-md text-sm font-medium"
          >
            Panel
          </a>
          <a
            href="/PacientesDashboard"
            className="hover:bg-background px-3 py-2 rounded-md text-sm font-medium"
          >
            Pacientes
          </a>
          <a
            href="/TrabajadoresDashboard"
            className="hover:bg-background px-3 py-2 rounded-md text-sm font-medium"
          >
            Trabajadores
          </a>
          <a
            href="/VisitasDashboard"
            className="hover:bg-background px-3 py-2 rounded-md text-sm font-medium"
          >
            Visitas
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default MenuDashboard;