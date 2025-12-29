export interface Nodo {
  id: string;
  nombre: string;
  descripcion: string;
  proyectoId: string;
  estado: string;
  bateria: number;
  ultimaConexion: Date;
}
