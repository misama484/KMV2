import React, { useState } from 'react';
import axios from 'axios';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  trabajador: Trabajador | null; // Trabajador seleccionado para cambiar la contraseña
  onPasswordChanged: () => void; // Callback para actualizar la lista o mostrar un mensaje de éxito
}

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ isOpen, onClose, trabajador, onPasswordChanged }) => {
  const [actualPassword, setActualPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async () => {
    if (!trabajador?.id) {
      setError('No se ha seleccionado un trabajador.');
      return;
    }

    if (!actualPassword) {
      setError('Debe ingresar la contraseña actual.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/trabajador/${trabajador.id}/updatePassword`, 
        {
          currentPassword: actualPassword,
          newPassword: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Contraseña actualizada correctamente.');
        setTimeout(() => {
          setSuccessMessage('');
          onPasswordChanged(); // Llama al callback para actualizar la lista o mostrar un mensaje
          onClose(); // Cierra el modal
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error.response?.data || error.message);
      setError(
        error.response?.data?.message || 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña de {trabajador?.nombre}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña actual</label>
          <input
            type="password"
            value={actualPassword}
            onChange={(e) => setActualPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese la contraseña actual"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese la nueva contraseña"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirme la nueva contraseña"
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
            type="button"
            onClick={handleChangePassword}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordModal;