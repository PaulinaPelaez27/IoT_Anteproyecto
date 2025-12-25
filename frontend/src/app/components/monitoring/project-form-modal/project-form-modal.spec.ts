import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

import { ProjectFormModal } from './project-form-modal';
import { ModalService } from '../../../shared/ui/modal/modal.service';
import { ProjectService } from '../../../services/project.service';

describe('ProjectFormModal (integration)', () => {
  let fixture: ComponentFixture<ProjectFormModal>;
  let component: ProjectFormModal;

  const modalMock = {
    open: signal(true),
    hide: vi.fn(),
  };

  const projectServiceMock = {
    create: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormModal],
      providers: [
        { provide: ModalService, useValue: modalMock },
        { provide: ProjectService, useValue: projectServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormModal);
    component = fixture.componentInstance;
  });

  it('should create a project (create mode)', () => {
    component.mode = 'create';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid="name"]')).nativeElement;

    input.value = 'New Project';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');

    expect(projectServiceMock.create).toHaveBeenCalledWith({
      name: 'New Project',
    });

    expect(modalMock.hide).toHaveBeenCalled();
  });

  it('should update a project (update mode)', () => {
    component.mode = 'update';
    component.project = { id: '1', name: 'Old name', description: 'Old description' };

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid="name"]')).nativeElement;

    expect(input.value).toBe('Old name');

    input.value = 'Updated name';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');

    expect(projectServiceMock.update).toHaveBeenCalledWith('1', {
      name: 'Updated name',
    });

    expect(modalMock.hide).toHaveBeenCalled();
  });
});
