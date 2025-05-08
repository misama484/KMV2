import { Visita } from "../config/Types";
import Swal from 'sweetalert2';

const DetalleVisitaModal: React.FC<{ visita: Visita; onClose: () => void }> = ({ visita, onClose }) => {

  const eliminarCita = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/visitas/deleteVisita/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la cita');
      }
      //const data = await response.json();
      console.log('Cita eliminada:');
      onClose(); // Cierra el modal después de eliminar la cita

      // Aquí puedes actualizar el estado de las citas en tu componente padre si es necesario
      // onDelete(id); // Llama a la función de eliminación en el componente padre  
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Detalles de la Visita</h2>
        <p><strong>ID:</strong> {visita.id}</p>
        <p><strong>Paciente:</strong> {visita.paciente.nombre} {visita.paciente.apellidos}</p>
        <p><strong>Trabajador:</strong> {visita.trabajador.nombre} {visita.trabajador.apellidos}</p>
        <p><strong>Fecha:</strong> {visita.fecha}</p>
        <p><strong>Hora:</strong> {visita.hora}</p>
        <p><strong>Motivo:</strong> {visita.motivo}</p>
        <p><strong>Notas:</strong> {visita.notas}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Cerrar
        </button>
        <button
          onClick={() => {
            if (visita.id !== undefined) {
              Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará la cita de forma permanente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                  eliminarCita(visita.id); // Llama a la función para eliminar la cita
                  Swal.fire('Eliminado', 'La cita ha sido eliminada.', 'success');
                }
              });
            } else {
              console.error('El ID de la visita es undefined');
            }
          }} //como id es opcional, manejamos el caso de que sea undefined
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md ml-2"
        >
          Eliminar cita
        </button>
      </div>
    </div>
  );
};

export default DetalleVisitaModal;