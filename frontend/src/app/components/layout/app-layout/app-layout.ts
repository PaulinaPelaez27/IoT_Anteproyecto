import { Component, inject } from '@angular/core';
import { GlobalRail } from '../global-rail/global-rail';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextSidebar } from '../context-sidebar/context-sidebar';
import { Modal } from '../../../shared/ui';
import { ModalService } from '../../../shared/ui/modal/modal.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, GlobalRail, ContextSidebar, Modal],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  modal = inject(ModalService);
}
