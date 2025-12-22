import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-modal',
  standalone: true,
  templateUrl: './modal.html',
})
export class Modal {
  @Input() open = false;
  @Input() title = '';
  @Input() width: 'small' | 'medium' | 'large' = 'medium';

  @Output() close = new EventEmitter<void>();
}
