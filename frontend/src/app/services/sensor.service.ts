import { Injectable, signal } from '@angular/core';
import { Sensor, Reading } from '../models/sensor.model';

const MOCK_SENSORS: Sensor[] = [
  {
    id: 'sensor-1',
    name: 'Temperature Sensor A1',
    type: 'Temperature',
    status: 'active',
    nodeId: 'node-1',
    readingTypes: [
      {
        id: 'rt-1',
        name: 'Temperatura',
        description: 'Ambient temperature',
        unit: '°C',
        varJson: 'temp',
        thresholds: { min: 15, max: 30, warningMin: 18, warningMax: 28 },
      },
      {
        id: 'rt-1b',
        name: 'Humedad',
        description: 'Humedad ambiental',
        unit: '%',
        varJson: 'humidity',
        thresholds: { min: 20, max: 100, warningMin: 30, warningMax: 100 },
      },
    ],
  },
  {
    id: 'sensor-2',
    name: 'Humidity Sensor A1',
    type: 'Humidity',
    status: 'active',
    nodeId: 'node-1',
    readingTypes: [
      {
        id: 'rt-2',
        name: 'Humidity',
        description: 'Relative humidity',
        unit: '%',
        varJson: 'humidity',
        thresholds: { min: 30, max: 70, warningMin: 35, warningMax: 65 },
      },
    ],
  },
  {
    id: 'sensor-3',
    name: 'Pressure Sensor B1',
    type: 'Pressure',
    status: 'warning',
    nodeId: 'node-2',
    readingTypes: [
      {
        id: 'rt-3',
        name: 'Pressure',
        description: 'Air pressure',
        unit: 'Pa',
        varJson: 'pressure',
        thresholds: { min: 950, max: 1050, warningMin: 970, warningMax: 1030 },
      },
    ],
  },
  {
    id: 'sensor-4',
    name: 'Vibration Sensor C1',
    type: 'Vibration',
    status: 'error',
    nodeId: 'node-3',
    readingTypes: [
      {
        id: 'rt-4',
        name: 'Vibration',
        description: 'Machine vibration level',
        unit: 'mm/s',
        varJson: 'vibration',
        thresholds: { min: 0, max: 10, warningMin: 2, warningMax: 8 },
      },
    ],
  },
  {
    id: 'sensor-5',
    name: 'Temperature Sensor CS1',
    type: 'Temperature',
    status: 'active',
    nodeId: 'node-4',
    readingTypes: [
      {
        id: 'rt-5',
        name: 'Temperature',
        description: 'Cold storage temperature',
        unit: '°C',
        varJson: 'temp',
        thresholds: { min: -5, max: 5, warningMin: -3, warningMax: 3 },
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
  private readingsSignal = signal<Map<string, Reading[]>>(new Map());

  sensors = this.sensorsSignal.asReadonly();
  selectedSensorId = this.selectedSensorIdSignal.asReadonly();

  selectSensor(id: string | null): void {
    this.selectedSensorIdSignal.set(id);
  }

  getAll(): Sensor[] {
    return this.sensors();
  }

  getByNodeId(nodeId: string): Sensor[] {
    return this.sensors().filter((s) => s.nodeId === nodeId);
  }

  getById(id: string): Sensor | undefined {
    return this.sensors().find((s) => s.id === id);
  }

  getReadings(sensorId: string, typeId: string, hours: number = 24): Reading[] {
    // Generate mock readings
    const readings: Reading[] = [];
    const now = Date.now();
    const interval = (hours * 60 * 60 * 1000) / 50; // 50 data points

    for (let i = 0; i < 50; i++) {
      readings.push({
        typeId,
        value: Math.random() * 30 + 15, // Random value
        timestamp: new Date(now - (49 - i) * interval),
      });
    }

    return readings;
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
