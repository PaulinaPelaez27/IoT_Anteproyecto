import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  styles: [
    `
      :host ::ng-deep svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  template: `
    <span [attr.title]="tooltip" class="inline-flex">
      <button
        [type]="type"
        [class]="classes"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabelComputed"
        (click)="handleClick($event)"
      >
        <span
          class="inline-flex items-center justify-center"
          [class]="iconOnly ? iconSizeClass : ''"
        >
          <ng-content></ng-content>
        </span>
      </button>
    </span>
  `,
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() iconOnly = false;
  @Input() ariaLabel?: string;
  @Input() tooltip?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    return [
      'inline-flex items-center justify-center transition-colors rounded-lg',
      this.baseSizeClass,
      this.variantClass,
      this.iconOnly ? 'p-2' : this.sizeClass,
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].join(' ');
  }

  private get baseSizeClass(): string {
    return 'gap-2';
  }

  private get variantClass(): string {
    switch (this.variant) {
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400';
      case 'secondary':
        return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600';
      case 'danger':
        return 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600';
      default:
        return 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600';
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

  get ariaLabelComputed(): string | null {
    return this.ariaLabel || this.tooltip || null;
  }

  get iconSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  }
}
