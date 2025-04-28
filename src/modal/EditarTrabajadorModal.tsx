import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditarTrabajadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trabajador: Trabajador | null; // Trabajador seleccionado para editar
  onTrabajadorUpdated: () => void; // Callback para actualizar la lista de trabajadores
}

const EditarTrabajadorModal: React.FC<EditarTrabajadorModalProps> = ({ isOpen, onClose, trabajador, onTrabajadorUpdated }) => {
  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    apellidos: '',
    dni: '',
    direccion: '',
    email: '',
    telefono: '',
    cargo: '',
    notas: '',
    password: '', // Añadido el campo password
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (trabajador) {
      setFormData({
        id: trabajador.id,
        nombre: trabajador.nombre,
        apellidos: trabajador.apellidos,
        dni: trabajador.dni,
        direccion: trabajador.direccion,
        email: trabajador.email,
        telefono: trabajador.telefono ,
        cargo: trabajador.cargo,
        notas: trabajador.notas || '',
        password: trabajador.password,
      });
    }
  }, [trabajador]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      //Para evitar que se modifique la cntraseña al editar el trabajador, se excluye el campo password del formData
      const { password, ...dataToSend } = formData; // Excluye el campo `password` si existe
      console.log('Datos a enviar:', dataToSend); // Verifica los datos que se envían 
      await axios.put(`http://localhost:8080/trabajador/updateTrabajador`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTrabajadorUpdated(); // Llama al callback para actualizar la lista de trabajadores
      onClose(); // Cierra el modal
    } catch (error: any) {
      console.error('Error al editar el trabajador:', error.response?.data || error.message);
      setError('Error al editar el trabajador. Por favor, inténtalo de nuevo.');
    }
  };

  if (!isOpen || !trabajador) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Trabajador</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Dni</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notas</label>
            <input
              type="text"
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"              
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Guardar
            </button>
          </div>        
        </form>
      </div>
    </div>
  );
};

export default EditarTrabajadorModal;

