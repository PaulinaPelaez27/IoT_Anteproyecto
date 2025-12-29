import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../../services/sensor.service';
import { ClickOutsideDirective } from '../../../shared/utils/click-outside.directive';
import { Button } from '../../../shared/ui';
import { TimeSeriesChart, ChartSeries } from '../time-series-chart/time-series-chart';

@Component({
  selector: 'app-sensor-details-view',
  templateUrl: './sensor-details-view.html',
  styleUrls: ['./sensor-details-view.css'],
  imports: [CommonModule, ClickOutsideDirective, Button, TimeSeriesChart],
})
export class SensorDetailsView {
  sensorService = inject(SensorService);

  sensorId = this.sensorService.selectedSensorId;
  activeTab = signal<'live-data' | 'threshold' | 'resume'>('live-data');

  sensorDetails = computed(() => {
    const id = this.sensorId();
    return id ? this.sensorService.getById(id) : undefined;
  });

  lecturasByTipo = (tipoId?: string) =>
    computed(() => {
      const sensor = this.sensorDetails();
      if (!sensor || !sensor.tiposDeLectura) return {};

      // tipoDeLectura can be an array or a single value
      const tipos = Array.isArray(sensor.tiposDeLectura)
        ? sensor.tiposDeLectura
        : [sensor.tiposDeLectura];

      const filteredTipos = tipoId ? tipos.filter((t) => String(t) === tipoId) : tipos;

      const readings: Record<string, any[]> = {};
      for (const tipo of filteredTipos) {
        readings[String(tipo)] = this.sensorService.getReadings(sensor.id, String(tipo)) || [];
      }
      console.log('readingsByTipo:', readings);
      return readings;
    });

  // Helper to create chart series from readings
  getChartSeries(readingTypeId: string): ChartSeries[] {
    const readings = this.lecturasByTipo(readingTypeId)();
    const data = readings[readingTypeId] || [];

    return [
      {
        name: 'Actual',
        data: data,
        color: '#3b82f6',
        showArea: true,
      },
      {
        name: 'Predicted',
        data: data.map((d: any) => ({
          timestamp: d.timestamp,
          value: d.value * 1.05,
        })),
        color: '#a855f7',
        showArea: false,
      },
      {
        name: 'Hypothetical',
        data: data.map((d: any) => ({
          timestamp: d.timestamp,
          value: d.value * 0.95,
        })),
        color: '#10b981',
        showArea: false,
      },
    ];
  }

  constructor() {
    effect(() => {
      const id = this.sensorId();
      const sensor = this.sensorDetails();
      console.log('SensorDetailsView: selectedSensorId changed to:', id);
      console.log('SensorDetailsView: sensorDetails:', sensor);
    });
  }

  //close the sensor details view
  closeDetailsView() {
    this.sensorService.selectSensor(null);
  }

  setActiveTab(tab: 'live-data' | 'threshold' | 'resume') {
    this.activeTab.set(tab);
  }
}
