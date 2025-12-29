import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';
import { NodoService } from '../../../services/nodo.service';
import { SensorService } from '../../../services/sensor.service';
import { Button } from '../../../shared/ui';
import { LucideAngularModule, Pencil, Trash, Battery } from 'lucide-angular';
// para usar modal
import { ModalService } from '../../../shared/ui/modal/modal.service';

@Component({
  selector: 'app-proyecto-view',
  imports: [CommonModule, RouterModule, Button, LucideAngularModule],
  templateUrl: './proyecto-view.html',
})
export class ProyectoView {
  proyectoService = inject(ProyectoService);
  nodoService = inject(NodoService);
  sensorService = inject(SensorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  modal = inject(ModalService);

  projectId = this.proyectoService.selectedProyectoId;
  selectedNodeId = this.nodoService.selectedNodoId;

  constructor() {
    // Al cargar nodes/sensors, selectiona el primer node disponible
    effect(() => {
      const nodes = this.nodes();
      const currentSelectedId = this.selectedNodeId();

      // Si no hay nodos, deseleccionar
      if (nodes.length === 0) {
        if (currentSelectedId !== null) {
          this.nodoService.selectNodo(null);
        }
        return;
      }

      // Si el nodo seleccionado no existe, seleccionar el primero
      const nodeExists = currentSelectedId && nodes.some((n) => n.id === currentSelectedId);
      if (!nodeExists) {
        this.nodoService.selectNodo(nodes[0].id);
      }
    });
  }

  // icons
  readonly pencilIcon = Pencil;
  readonly trashIcon = Trash;
  readonly batteryIcon = Battery;

  project = computed(() => {
    const id = this.projectId();
    return id ? this.proyectoService.getById(id) : undefined;
  });

  nodes = computed(() => {
    const id = this.projectId();
    return id ? this.nodoService.getByProjectId(id) : [];
  });

  selectedNode = computed(() => {
    const nodeId = this.selectedNodeId();
    return nodeId ? this.nodoService.getById(nodeId) : this.nodes()[0];
  });

  sensors = computed(() => {
    const node = this.selectedNode();
    return node ? this.sensorService.getByNodeId(node.id) : [];
  });

  getStatusColor(status: string): string {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
      case 'offline':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  }

  getSensorStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  }

  openEditProject(): void {
    const project = this.project();
    if (!project) return;

    this.modal.show('Cambios en el proyecto', 'medium');

    this.router.navigate([{ outlets: { modal: ['project', 'edit', project.id] } }]);
  }
}
