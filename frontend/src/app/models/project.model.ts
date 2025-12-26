export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado?: boolean;
  creadoEn: Date;
  empresaId: string;
}
