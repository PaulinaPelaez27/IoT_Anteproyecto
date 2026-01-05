import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../../services/sensor.service';
import { TimeSeriesChart, ChartSeries } from '../time-series-chart/time-series-chart';

@Component({
  selector: 'app-sensor-details-view',
  templateUrl: './sensor-details-view.html',
  styleUrls: ['./sensor-details-view.css'],
  imports: [CommonModule, TimeSeriesChart],
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

      // tiposDeLectura is always an array per the Sensor interface
      const tipos = sensor.tiposDeLectura;

       const filteredTipos = tipoId ? tipos.filter((t) => t && t.id === tipoId) : tipos;
      const readings: Record<string, any[]> = {};
      for (const tipo of filteredTipos) {
        const tipoIdKey = tipo?.id;
        if (!tipoIdKey) continue;
        readings[tipoIdKey] = this.sensorService.getReadings(sensor.id, tipoIdKey) || [];
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
        data: data.map((d: any) => ({
          timestamp: d.timestamp,
          value: d.valor * 1.05,
        })),
        color: '#3b82f6',
        showArea: true,
      },
      {
        name: 'Predicted',
        data: data.map((d: any) => ({
          timestamp: d.timestamp,
          value: d.valor * 1.05,
        })),
        color: '#a855f7',
        showArea: false,
      },
    ];
  }

  // close the sensor details view
  closeDetailsView() {
    this.sensorService.selectSensor(null);
  }

  setActiveTab(tab: 'live-data' | 'threshold' | 'resume') {
    this.activeTab.set(tab);
  }
}
