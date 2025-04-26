import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditarPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null; // Paciente seleccionado para editar
  onPacienteUpdated: () => void; // Callback para actualizar la lista de pacientes
}

const EditarPacienteModal: React.FC<EditarPacienteModalProps> = ({ isOpen, onClose, paciente, onPacienteUpdated }) => {
  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    apellidos: '',
    direccion: '',
    email: '',
    telefono: '',
    notas: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (paciente) {
      setFormData({
        id: paciente.id,
        nombre: paciente.nombre,
        apellidos: paciente.apellidos,
        direccion: paciente.direccion,
        email: paciente.email,
        telefono: paciente.telefono,
        notas: paciente.notas || '',
      });
    }
  }, [paciente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`http://localhost:8080/paciente/updatePaciente`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPacienteUpdated(); // Llama al callback para actualizar la lista de pacientes
      onClose(); // Cierra el modal
    } catch (error: any) {
      console.error('Error al editar el paciente:', error.response?.data || error.message);
      setError('Error al editar el paciente. Por favor, inténtalo de nuevo.');
    }
  };

  if (!isOpen || !paciente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Paciente</h2>
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
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
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

export default EditarPacienteModal;