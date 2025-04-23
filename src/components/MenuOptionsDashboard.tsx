import React from 'react';
import BotonBuscar from './BotonBuscar';

const MenuOptionsDashboard = () => {
  

  return (
    <div className="">        
        <div className="flex items-center">        
          <div className="flex space-x-3">            
            <button className="bg-background hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
              Editar 
            </button>
            <button className="bg-red-600 hover:bg-white px-4 py-2 rounded-md text-sm font-medium">
              Eliminar
            </button>
          </div>
        </div>        
      </div>
  );
};

export default MenuOptionsDashboard;