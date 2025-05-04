import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  visitas: Visita[];
  onSave: (cita: {
    trabajador: Trabajador;
    paciente: Paciente;
    fecha: string;
    hora: string;
    motivo: string;
    notas: string;
  }) => void;
}


const ReservarCitaModal: React.FC<ReservarCitaModalProps> = ({
  isOpen,
  onClose,
  trabajadores,
  pacientes,
  visitas,
  onSave,
}) => {
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [motivo, setMotivo] = useState<string>('');
  const [notas, setNotas] = useState<string>('');
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  
 
  // Filtrar visitas cuando se selecciona un trabajador
  useEffect(() => {
    if (selectedTrabajador) {
      const events = visitas
        .filter((visita) => visita.trabajador.id === selectedTrabajador.id) // Filtrar visitas del trabajador seleccionado
        .map((visita) => ({
          title: `Paciente: ${visita.paciente.nombre} ${visita.paciente.apellidos}`,
          start: `${visita.fecha}T${visita.hora}`, // Combina fecha y hora
          end: `${visita.fecha}T${visita.hora}`, // Puedes ajustar la duración si es necesario
        }));
      setFilteredEvents(events); // Actualizar los eventos filtrados
    } else {
      setFilteredEvents([]); // Si no hay trabajador seleccionado, limpiar eventos
    }
  }, [selectedTrabajador, visitas]);


  const handleSave = async () => {
    if (!selectedTrabajador || !selectedPaciente || !selectedDate || !selectedTime || !motivo) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    //const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // Formato yyyy-MM-dd
  
    const nuevaCita = {
      fecha: selectedDate,
      hora: selectedTime,
      motivo: motivo,
      notas: notas,
      paciente: selectedPaciente,
      trabajador: selectedTrabajador,
    };

    console.log('Datos enviados:', nuevaCita);
  
    try {
      // Enviar la cita al backend
      const token = sessionStorage.getItem('token');
      console.log("TOKEN: " + token); // Verifica si el token se obtiene correctamente
      const response = await axios.post('http://localhost:8080/visitas/newVisita', nuevaCita, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Cita guardada exitosamente:', response.data);
      alert('Cita guardada exitosamente.');
  
      onSave(nuevaCita); // Llama al callback para actualizar el estado en el componente padre
      onClose(); // Cierra la modal después de guardar
    } catch (error: any) {
      console.error('Error al guardar la cita:', error);
  
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Respuesta del servidor:', error.response.data);
        alert(`Error al guardar la cita: ${error.response.data.message || 'Error desconocido.'}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
        alert('No se recibió respuesta del servidor. Por favor, verifica tu conexión.');
      } else {
        // Algo sucedió al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
        alert('Hubo un error al configurar la solicitud. Por favor, inténtalo de nuevo.');
      }
    }
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
            events={filteredEvents} // Asigna los eventos al calendario
            selectable={true}
            select={(info) => {
              const startDate = new Date(info.startStr);
              setSelectedDate(startDate.toISOString()); // Formatea la fecha
              setSelectedTime(startDate.toLocaleTimeString());
            }}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: ''
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
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
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