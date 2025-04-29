import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import '../styles/CalendarioDashboard.css'; // Asegúrate de tener este archivo CSS para estilos personalizados

interface CalendarioDashboardProps {
  onDateChange: (date: Date) => void; // Callback para notificar al padre sobre el cambio de fecha
}

const CalendarioDashboard: React.FC<CalendarioDashboardProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date); // Actualiza el estado local
    onDateChange(date); // Notifica al componente padre
  };

  return (
    <div className="bg-primary shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendario</h2>
      </div>
      <p className="text-lg mb-4">
        Día seleccionado: {selectedDate ? selectedDate.toLocaleDateString() : 'Ninguno'}
      </p>
      <Calendar onChange={handleDateChange} value={selectedDate}/>
    </div>
  );
};

export default CalendarioDashboard;