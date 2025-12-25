import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Modal } from './modal';

describe('Modal', () => {
  let fixture: ComponentFixture<Modal>;
  let component: Modal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT render modal when open is false', () => {
    component.open = false;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.bg-black\\/40'));
    expect(overlay).toBeNull();
  });

  it('should render modal when open is true', () => {
    component.open = true;
    fixture.detectChanges();

    const modalContainer = fixture.debugElement.query(By.css('.fixed.inset-0.z-50'));
    expect(modalContainer).toBeTruthy();
  });

  it('should display the title', () => {
    component.open = true;
    component.title = 'Create Project';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Create Project');
  });

  it('should emit close when overlay is clicked', () => {
    component.open = true;
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.close, 'emit');

    const overlay = fixture.debugElement.query(By.css('.bg-black\\/40'));
    overlay.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit close when close button is clicked', () => {
    component.open = true;
    fixture.detectChanges();

    vi.spyOn(component.close, 'emit');

    const closeBtn = fixture.debugElement.query(By.css('button'));
    closeBtn.triggerEventHandler('click');

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should apply correct width class', () => {
    component.open = true;
    component.width = 'large';
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('.bg-white.rounded-xl'));

    expect(modal.nativeElement.classList).toContain('max-w-lg');
  });
});
