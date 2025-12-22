import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private openSignal = signal(false);
  private titleSignal = signal('');
  private widthSignal = signal<'small' | 'medium' | 'large'>('medium');

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
  }
}
