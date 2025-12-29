import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../../services/sensor.service';
import { ClickOutsideDirective } from '../../../shared/utils/click-outside.directive';
import { Button } from '../../../shared/ui';

@Component({
  selector: 'app-sensor-details-view',
  templateUrl: './sensor-details-view.html',
  styleUrls: ['./sensor-details-view.css'],
  imports: [CommonModule, ClickOutsideDirective, Button],
})
export class SensorDetailsView {
  sensorService = inject(SensorService);

  sensorId = this.sensorService.selectedSensorId;
  activeTab = signal<'live-data' | 'threshold' | 'resume'>('live-data');

  // readings
  readings = computed(() => {
    const id = this.sensorId();
    const sensor = this.sensorDetails();
    if (id && sensor) {
      const tipoId = sensor.tiposDeLectura[0]?.id;
      if (tipoId) {
        return this.sensorService.getReadings(id, tipoId, 24);
      }
    }
    return [];
  });

  sensorDetails = computed(() => {
    const id = this.sensorId();
    return id ? this.sensorService.getById(id) : undefined;
  });

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
