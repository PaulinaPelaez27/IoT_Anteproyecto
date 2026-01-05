export interface TiposLectura {
  id: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  varJson: string;
  umbrales: {
    min: number;
    max: number;
    warningMin?: number;
    warningMax?: number;
  };
}

export interface Lectura {
  sensorId: string;
  tipoId: string;
  valor: number;
  timestamp: Date;
}

export interface Sensor {
  id: string;
  nombre: string;
  tipo: string;
  estado: boolean;
  nodoId: string;
  tiposDeLectura: TiposLectura[];
}
