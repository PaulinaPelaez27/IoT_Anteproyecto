export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
  empresaId: number;     // relación con empresa
  creadoEn: string;
  modificadoEn?: string | null;
  borradoEn?: string | null;
}
