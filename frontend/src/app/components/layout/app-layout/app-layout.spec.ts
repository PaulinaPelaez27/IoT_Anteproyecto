import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';

import { AppLayout } from './app-layout';
import { ModalService } from '../../../shared/ui/modal/modal.service';

describe('AppLayout', () => {
  let fixture: ComponentFixture<AppLayout>;
  let component: AppLayout;

  const modalServiceMock = {
    open: signal(false),
    title: signal(''),
    width: signal<'small' | 'medium' | 'large'>('medium'),
    hide: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppLayout,
        RouterTestingModule, // needed for router-outlet
      ],
      providers: [{ provide: ModalService, useValue: modalServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ui-modal', () => {
    const modal = fixture.debugElement.query(By.css('ui-modal'));
    expect(modal).toBeTruthy();
  });

  it('should pass modal state to ui-modal (open = true)', () => {
    modalServiceMock.open.set(true);
    modalServiceMock.title.set('Test Modal');
    modalServiceMock.width.set('large');

    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('ui-modal'));
    const modalCmp = modal.componentInstance;

    expect(modalCmp.open).toBe(true);
    expect(modalCmp.title).toBe('Test Modal');
    expect(modalCmp.width).toBe('large');
  });

  it('should call modal.hide() when modal emits close', () => {
    const modal = fixture.debugElement.query(By.css('ui-modal'));

    modal.triggerEventHandler('close');

    expect(modalServiceMock.hide).toHaveBeenCalled();
  });

  it('should have a named router-outlet for modal content', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet[name="modal"]'));

    expect(outlet).toBeTruthy();
  });
});
