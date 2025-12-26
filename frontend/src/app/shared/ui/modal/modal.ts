import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'ui-modal',
  standalone: true,
  templateUrl: './modal.html',
  imports: [LucideAngularModule],
})
export class Modal implements AfterViewInit, OnDestroy, OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() width: 'small' | 'medium' | 'large' = 'medium';

  @Output() close = new EventEmitter<void>();

  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef<HTMLElement>;

  private previouslyFocusedElement: HTMLElement | null = null;
  private boundKeydownHandler = this.handleKeydown.bind(this);

  closeIcon = X;

  ngAfterViewInit() {
    if (this.open) {
      this.setFocus();
      document.addEventListener('keydown', this.boundKeydownHandler);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.open) {
        this.setFocus();
        document.addEventListener('keydown', this.boundKeydownHandler);
      } else {
        this.restoreFocus();
        document.removeEventListener('keydown', this.boundKeydownHandler);
      }
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.boundKeydownHandler);
  }

  private setFocus() {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    setTimeout(() => {
      if (this.modalContent && this.modalContent.nativeElement) {
        this.modalContent.nativeElement.focus();
      }
    });
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.open) return;

    if (event.key === 'Escape') {
      this.close.emit();
      event.stopPropagation();
      event.preventDefault();
    } else if (event.key === 'Tab') {
      this.trapTab(event);
    }
  }

  private trapTab(event: KeyboardEvent) {
    if (!this.modalContent) return;
    const focusableElements = this.modalContent.nativeElement.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
    );
    const elements = Array.prototype.slice.call(focusableElements) as HTMLElement[];
    if (elements.length === 0) {
      event.preventDefault();
      return;
    }
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
}
