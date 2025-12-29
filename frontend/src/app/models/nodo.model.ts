export interface Nodo {
  id: string;
  nombre: string;
  descripcion: string;
  proyectoId: string;
  estado: boolean;
  bateria: number;
  ultimaConexion: Date;
}
