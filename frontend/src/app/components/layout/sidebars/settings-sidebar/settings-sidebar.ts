import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './settings-sidebar.html',
})
export class SettingsSidebar {}
