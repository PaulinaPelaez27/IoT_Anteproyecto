import { Component } from '@angular/core';
import { GlobalRail } from '../global-rail/global-rail';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextSidebar } from '../context-sidebar/context-sidebar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, GlobalRail, ContextSidebar],
  templateUrl: './app-layout.html',
})
export class AppLayout {}
