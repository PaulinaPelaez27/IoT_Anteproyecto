import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private openSignal = signal(false);
  private titleSignal = signal('');
  private widthSignal = signal<'small' | 'medium' | 'large'>('medium');
  private router = inject(Router);

  open = this.openSignal.asReadonly();
  title = this.titleSignal.asReadonly();
  width = this.widthSignal.asReadonly();

  show(title: string, width: 'small' | 'medium' | 'large' = 'medium') {
    this.titleSignal.set(title);
    this.widthSignal.set(width);
    this.openSignal.set(true);
  }

  hide() {
    this.openSignal.set(false);
    // Clear the modal outlet from the URL
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
