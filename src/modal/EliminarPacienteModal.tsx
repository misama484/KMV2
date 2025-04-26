import React, { useState } from 'react';
import axios from 'axios';

interface EliminarPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null; // Paciente seleccionado para eliminar
  onPacienteUpdated: () => void; // Callback para actualizar la lista de pacientes
}

const EliminarPacienteModal: React.FC<EliminarPacienteModalProps> = ({ isOpen, onClose, paciente, onPacienteUpdated }) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEliminar = async () => {
    if (!paciente) return;

    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:8080/paciente/deactivatePaciente?id=${paciente.id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage('Paciente desactivado correctamente.');
      onPacienteUpdated(); // Actualiza la lista de pacientes
      setTimeout(() => {
        setSuccessMessage('');
        onClose(); // Cierra el modal después de un breve retraso
      }, 2000);
    } catch (error: any) {
      console.error('Error al eliminar el paciente:', error.response?.data || error.message);
      setError('Error al eliminar el paciente. Por favor, inténtalo de nuevo.');
    }
  };

  if (!isOpen || !paciente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Eliminar Paciente</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar al paciente{' '}
          <strong>{`${paciente.nombre} ${paciente.apellidos}`}</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleEliminar}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarPacienteModal;