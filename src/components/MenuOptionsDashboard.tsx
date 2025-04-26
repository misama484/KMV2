import React from 'react';

interface MenuOptionsDashboardProps {
  editarPaciente: () => void; // Función que se ejecuta al hacer clic en "Editar"
  eliminarPaciente: () => void; // Función que se ejecuta al hacer clic en "Eliminar"
}

const MenuOptionsDashboard: React.FC<MenuOptionsDashboardProps> = ({editarPaciente, eliminarPaciente}) => {
  

  return (
    <div className="">        
        <div className="flex items-center">        
          <div className="flex space-x-3">            
            <button 
              className="bg-background hover:bg-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={editarPaciente} // Abre el modal al hacer clic
              >
              Editar 
            </button>
            <button 
            className="bg-red-600 hover:bg-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={eliminarPaciente} // Abre el modal al hacer clic
            >
              Eliminar
            </button>
          </div>
        </div>        
      </div>
  );
};

export default MenuOptionsDashboard;