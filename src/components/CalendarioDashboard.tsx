import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ReservarCitaModal from '../modal/ReservarCitaModal'; // Asegúrate de que la ruta sea correcta

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

interface CalendarioDashboardProps {
  onDateChange: (date: Date) => void; // Callback para notificar al padre sobre el cambio de fecha
  pacientes: Paciente[]; // Lista de pacientes
  trabajadores: Trabajador[]; // Lista de trabajadores
  visitas: Visita[]; // Lista de visitas
}

const CalendarioDashboard: React.FC<CalendarioDashboardProps> = ({ onDateChange, pacientes, trabajadores, visitas }) => {
  const [selectedDate, setSelectedDate] = useState<String | null>(null);
  const [selectedTime, setSelectedTime] = useState<String | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la apertura del modal


  const handleDateChange = (date: Date) => {
    onDateChange(date); // Notifica al componente padre
    console.log('Fecha seleccionada:', date.toLocaleDateString());
    console.log('Hora seleccionada:', date.toLocaleTimeString());
  };

  /*const handleSaveCita = (nuevaCita: Visita) => {
    setListaVisitas((prevVisitas) => [...prevVisitas, nuevaCita]); // Agrega la nueva cita al estado
  };*/

    const events = visitas.map((visita) => ({
    title: `Paciente: ${visita.paciente.nombre + ' ' + visita.paciente.apellidos} - Trabajador: ${visita.trabajador.nombre + ' ' + visita.trabajador.apellidos}`,
    start: `${visita.fecha}T${visita.hora}`, // Combina fecha y hora
    end: `${visita.fecha}T${visita.hora}`, // Puedes ajustar la duración si es necesario
  }));

  //TODO : Cambiar el color de los eventos según el estado de la visita
  //TODO : Cambiar el color de los eventos según el trabajador
  //TODO : Cambiar el color de los eventos según el paciente
  //TODO : Incorporar get para mostrar visitas en agenda de modal
  //
  //TODO : La lista de visitas no se actualiza al agregar una nueva visita. Se debe actualizar el estado de la lista de visitas en el componente padre y pasarla como prop al componente hijo.

  return (
    <div className="bg-primary shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">              
        <h2 className="text-2xl font-bold">Calendario</h2>
      </div>
      <p className="text-lg mb-4">
        Día seleccionado: {selectedDate || 'Ninguno'}
      </p>
      <p className="text-lg mb-4">
        Hora seleccionado: {selectedTime || 'Ninguna'}
      </p>
      <div className="mb-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Reservar Cita
      </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        initialView="timeGridWeek"
        events={events} // Asigna los eventos al calendario
        eventColor="#378006" // Color de los eventos
        height={700}
        selectable={true}
        select={(info) => {
          const startDate = new Date(info.startStr); // Fecha y hora de inicio seleccionadas
          const formattedDate = startDate.toLocaleDateString(); // Formatea la fecha
          //const formattedTime = startDate.toLocaleTimeString(); // Formatea la hora
          if (info.allDay || info.view.type === 'dayGridMonth') {
            // Si es un evento de día completo o está en el modo dayGridMonth
            setSelectedDate(formattedDate); // Actualiza la fecha
            setSelectedTime(null); // Elimina la hora
          } else {
            const formattedTime = startDate.toLocaleTimeString(); // Formatea la hora
            setSelectedDate(formattedDate); // Actualiza la fecha
            setSelectedTime(formattedTime); // Actualiza la hora
          }

          // Llama al callback para manejar el cambio de fecha
          handleDateChange(startDate);
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        eventClick={(info) => {
          const appointment = info.event.extendedProps.appointment;
          alert(`Appointment with ${appointment.client.first_name} ${appointment.client.last_name} for ${appointment.service.name}`);
        }}
      />

<ReservarCitaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trabajadores={trabajadores}
        pacientes={pacientes}
        visitas={visitas}
        onSave={(nuevaCita) => {handleSaveCita(nuevaCita); setIsModalOpen(false);}}
      />
      
    </div>
  );
};

export default CalendarioDashboard;