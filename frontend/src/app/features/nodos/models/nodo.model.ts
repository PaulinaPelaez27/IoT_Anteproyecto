export interface Nodo {
  id: number;
  nombre: string;
  descripcion?: string | null;
  proyectoId: number;
  // opcional, por si el backend devuelve el proyecto “join”
  proyecto?: {
    id: number;
    nombre: string;
  } | null;
  estado: boolean;
}