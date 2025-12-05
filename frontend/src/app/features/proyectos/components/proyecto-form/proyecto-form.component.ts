import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.scss'],
})
export class ProyectoFormComponent implements OnInit {

  @Input() initialData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      estado: [true],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue({
        nombre: this.initialData.nombre,
        descripcion: this.initialData.descripcion,
        estado: this.initialData.estado,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}
