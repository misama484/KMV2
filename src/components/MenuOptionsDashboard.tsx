import React from 'react';
import BotonBuscar from './BotonBuscar';

const MenuOptionsDashboard = (funcionBusqueda) => {
  

  return (
    <div className="bg-primary rounded-xl  shadow-md mb-8">
      <h1 className="text-2xl font-bold text-white flex justify-center">Opciones</h1>
      <div className="container mx-auto px-4 py-4 flex justify-evenly items-center ">        
        <div className="flex justify-around items-center">
          <BotonBuscar        
          placeholder="Buscar paciente por nombre..."
          onSearch={funcionBusqueda.funcionBusqueda}
          />
          <div className="flex space-x-3">
            <button className="bg-background hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
              Añadir
            </button>
            <button className="bg-background hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
              Editar 
            </button>
            <button className="bg-red-600 hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
              Eliminar
            </button>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default MenuOptionsDashboard;