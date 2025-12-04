import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-nodo-form',
  standalone: true,
  templateUrl: './nodo-form.component.html',
  styleUrls: ['./nodo-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
})
export class NodoFormComponent implements OnInit {
  @Input() initialData: any = null;
  @Input() proyectos: any[] = []; // 🔹 lista para el dropdown

  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      proyectoId: [null, Validators.required],
      estado: [true],
    });
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue({
        nombre: this.initialData.nombre,
        descripcion: this.initialData.descripcion,
        proyectoId: this.initialData.proyectoId,
        estado: this.initialData.estado,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}