import { Injectable, signal } from '@angular/core';
import { Sensor, Lectura } from '../models/sensor.model';

const MOCK_SENSORS: Sensor[] = [
  {
    id: 'sensor-1',
    nombre: 'Temperature Sensor A1',
    tipo: 'Temperature',
    estado: true,
    nodoId: 'node-1',
    tiposDeLectura: [
      {
        id: 'rt-1',
        nombre: 'Temperatura',
        descripcion: 'Ambient temperature',
        unidad: '°C',
        varJson: 'temp',
        umbrales: { min: 15, max: 30, warningMin: 18, warningMax: 28 },
      },
      {
        id: 'rt-1b',
        nombre: 'Humedad',
        descripcion: 'Humedad ambiental',
        unidad: '%',
        varJson: 'humidity',
        umbrales: { min: 20, max: 100, warningMin: 30, warningMax: 100 },
      },
    ],
  },
  {
    id: 'sensor-2',
    nombre: 'Humidity Sensor A1',
    tipo: 'Humidity',
    estado: true,
    nodoId: 'node-1',
    tiposDeLectura: [
      {
        id: 'rt-2',
        nombre: 'Humedad',
        descripcion: 'Humedad relativa',
        unidad: '%',
        varJson: 'humidity',
        umbrales: { min: 30, max: 70, warningMin: 35, warningMax: 65 },
      },
    ],
  },
  {
    id: 'sensor-3',
    nombre: 'Pressure Sensor B1',
    tipo: 'Pressure',
    estado: true,
    nodoId: 'node-2',
    tiposDeLectura: [
      {
        id: 'rt-3',
        nombre: 'Presión',
        descripcion: 'Presión del aire',
        unidad: 'Pa',
        varJson: 'pressure',
        umbrales: { min: 950, max: 1050, warningMin: 970, warningMax: 1030 },
      },
    ],
  },
  {
    id: 'sensor-4',
    nombre: 'Vibration Sensor C1',
    tipo: 'Vibration',
    estado: false,
    nodoId: 'node-3',
    tiposDeLectura: [
      {
        id: 'rt-4',
        nombre: 'Vibración',
        descripcion: 'Nivel de vibración de la máquina',
        unidad: 'mm/s',
        varJson: 'vibration',
        umbrales: { min: 0, max: 10, warningMin: 2, warningMax: 8 },
      },
    ],
  },
  {
    id: 'sensor-5',
    nombre: 'Temperature Sensor CS1',
    tipo: 'Temperature',
    estado: true,
    nodoId: 'node-4',
    tiposDeLectura: [
      {
        id: 'rt-5',
        nombre: 'Temperatura',
        descripcion: 'Temperatura de almacenamiento en frío',
        unidad: '°C',
        varJson: 'temp',
        umbrales: { min: -5, max: 5, warningMin: -3, warningMax: 3 },
      },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private sensorsSignal = signal<Sensor[]>(MOCK_SENSORS);
  private selectedSensorIdSignal = signal<string | null>(null);
  private readingsSignal = signal<Map<string, Lectura[]>>(new Map());

  sensors = this.sensorsSignal.asReadonly();
  selectedSensorId = this.selectedSensorIdSignal.asReadonly();

  selectSensor(id: string | null): void {
    this.selectedSensorIdSignal.set(id);
  }

  getAll(): Sensor[] {
    return this.sensors();
  }

  getByNodeId(nodeId: string): Sensor[] {
    return this.sensors().filter((s) => s.nodoId === nodeId);
  }

  getById(id: string): Sensor | undefined {
    return this.sensors().find((s) => s.id === id);
  }

  getReadings(sensorId: string, typeId: string, hours: number = 24): Lectura[] {
    // Generate mock readings
    const lecturas: Lectura[] = [];
    const now = Date.now();
    const interval = (hours * 60 * 60 * 1000) / 50; // 50 data points

    for (let i = 0; i < 50; i++) {
      lecturas.push({
        tipoId: typeId,
        sensorId: sensorId,
        valor: Math.random() * 30 + 15, // Random value
        timestamp: new Date(now - (49 - i) * interval),
      });
    }

    return lecturas;
  }

  create(sensor: Omit<Sensor, 'id'>): Sensor {
    const newSensor: Sensor = {
      ...sensor,
      id: `sensor-${Date.now()}`,
    };
    console.log('SensorService: Creating sensor', newSensor);
    this.sensorsSignal.update((sensors) => [...sensors, newSensor]);
    return newSensor;
  }

  update(id: string, updates: Partial<Sensor>): Sensor | undefined {
    console.log('SensorService: Updating sensor', id, updates);
    const sensor = this.getById(id);
    if (!sensor) return undefined;

    const updated = { ...sensor, ...updates };
    this.sensorsSignal.update((sensors) => sensors.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  delete(id: string): boolean {
    console.log('SensorService: Deleting sensor', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.sensorsSignal.update((sensors) => sensors.filter((s) => s.id !== id));
    }
    return exists;
  }
}
