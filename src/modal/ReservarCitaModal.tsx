import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';



interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  notas: string;
}

interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  cargo: string;
}

interface Visita {
  id: number;
  paciente: Paciente;
  trabajador: Trabajador;
  motivo: string;
  notas: string;
  fecha: string;
  hora: string;
}

interface ReservarCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  trabajadores: Trabajador[];
  pacientes: Paciente[];
  onSave: (cita: {
    trabajadorId: number;
    pacienteId: number;
    fecha: string;
    hora: string;
    motivo: string;
    instrucciones: string;
  }) => void;
}


const ReservarCitaModal: React.FC<ReservarCitaModalProps> = ({
  isOpen,
  onClose,
  trabajadores,
  pacientes,
  onSave,
}) => {
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [motivo, setMotivo] = useState<string>('');
  const [instrucciones, setInstrucciones] = useState<string>('');

  const handleSave = () => {
    if (!selectedTrabajador || !selectedPaciente || !selectedDate || !selectedTime || !motivo) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    onSave({
      trabajadorId: selectedTrabajador.id,
      pacienteId: selectedPaciente.id,
      fecha: selectedDate,
      hora: selectedTime,
      motivo,
      instrucciones,
    });

    onClose(); // Cierra la modal después de guardar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Reservar Cita</h2>

        {/* Selección de trabajador */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Trabajador</label>
          <select
    value={selectedTrabajador?.id || ''} // Usa el id del trabajador como valor
    onChange={(e) => {
      const trabajadorSeleccionado = trabajadores.find(
        (trabajador) => trabajador.id === Number(e.target.value)
      );
      setSelectedTrabajador(trabajadorSeleccionado || null); // Asigna el objeto completo
    }}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="">Seleccionar trabajador</option>
    {trabajadores.map((trabajador) => (
      <option key={trabajador.id} value={trabajador.id}>
        {trabajador.nombre} {trabajador.apellidos} {/* Muestra nombre y apellidos */}
      </option>
    ))}
  </select>
        </div>

        {/* Calendario para seleccionar fecha y hora */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha y Hora</label>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            height={400}
            selectable={true}
            select={(info) => {
              const startDate = new Date(info.startStr);
              setSelectedDate(startDate.toLocaleDateString());
              setSelectedTime(startDate.toLocaleTimeString());
            }}
            headerToolbar={{
              left: '',
              center: 'title',
              right: '',
            }}
          />
          <p className="text-sm mt-2">
            Fecha seleccionada: {selectedDate || 'Ninguna'} - Hora seleccionada: {selectedTime || 'Ninguna'}
          </p>
        </div>

        {/* Selección de paciente */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Paciente</label>
          <select
            value={selectedPaciente?.id || ''} // Usa el id del paciente como valor
            onChange={(e) => {
              const pacienteSeleccionado = pacientes.find(
                (paciente) => paciente.id === Number(e.target.value)
              );
              setSelectedPaciente(pacienteSeleccionado || null); // Asigna el objeto completo
            }}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Seleccionar paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} {paciente.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Motivo de la visita */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Motivo de la visita</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Escribe el motivo de la visita..."
          />
        </div>

        {/* Instrucciones de la visita */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Instrucciones</label>
          <textarea
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Escribe las instrucciones de la visita..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservarCitaModal;