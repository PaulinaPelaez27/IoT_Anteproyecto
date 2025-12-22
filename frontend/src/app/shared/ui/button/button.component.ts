import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button [type]="type" [class]="classes" [disabled]="disabled" (click)="handleClick($event)">
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    return [
      'rounded-lg transition-colors inline-flex items-center justify-center gap-2',
      this.variantClass,
      this.sizeClass,
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].join(' ');
  }

  private get variantClass(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      default:
        return 'bg-red-600 text-white hover:bg-red-700';
    }
  }

  private get sizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'px-2 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
