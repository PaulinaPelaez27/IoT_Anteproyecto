import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProyectosService } from '../../services/proyectos.service';
import { ProyectoFormComponent } from '../../components/proyecto-form/proyecto-form.component';

@Component({
  selector: 'app-proyecto-create',
  standalone: true,
  templateUrl: './proyecto-create.component.html',
  styleUrls: ['./proyecto-create.component.scss'],
  imports: [
    CommonModule,
    ProyectoFormComponent,
  ],
})
export class ProyectoCreateComponent {

  constructor(
    private readonly proyectosService: ProyectosService,
    private readonly router: Router
  ) {}

  handleSubmit(data: any) {

    // 🔥 multi-tenant: empresaId viene del interceptor o desde auth
    const empresaId = Number(localStorage.getItem('empresaId') ?? 1);

    const payload = {
      ...data,
      empresaId,
    };

    this.proyectosService.create(payload).subscribe({
      next: () => this.router.navigate(['/proyectos']),
      error: err => console.error(err)
    });
  }
}
