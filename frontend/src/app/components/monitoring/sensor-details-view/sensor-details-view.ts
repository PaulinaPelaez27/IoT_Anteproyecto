import { Component, inject } from '@angular/core';
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

  //close the sensor details view
  closeDetailsView() {
    this.sensorService.selectSensor(null);
  }
}
