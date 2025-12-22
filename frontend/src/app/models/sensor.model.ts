export type SensorStatus = 'active' | 'warning' | 'error';

export interface ReadingType {
  id: string;
  name: string;
  description: string;
  unit: string;
  varJson: string;
  thresholds: {
    min: number;
    max: number;
    warningMin?: number;
    warningMax?: number;
  };
}

export interface Reading {
  typeId: string;
  value: number;
  timestamp: Date;
}

export interface Sensor {
  id: string;
  name: string;
  type: string;
  status: SensorStatus;
  nodeId: string;
  readingTypes: ReadingType[];
}
