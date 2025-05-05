export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  notas: string;
}

export interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  cargo: string;
}

export interface Visita {
  id?: number;
  fecha: string;
  hora: string;
  paciente: Paciente;
  trabajador: Trabajador;
  notas: string;
  motivo: string;
}

