import { Injectable, signal } from '@angular/core';
import { Nodo } from '../models/nodo.model';

const MOCK_NODES: Nodo[] = [
  {
    id: 'node-1',
    nombre: 'Production Line A',
    descripcion: 'Main production line sensors',
    proyectoId: 'project-1',
    estado: 'online',
    bateria: 87,
    ultimaConexion: new Date(),
  },
  {
    id: 'node-2',
    nombre: 'Quality Control Station',
    descripcion: 'Quality monitoring sensors',
    proyectoId: 'project-1',
    estado: 'online',
    bateria: 92,
    ultimaConexion: new Date(),
  },
  {
    id: 'node-3',
    nombre: 'Assembly Line B',
    descripcion: 'Secondary assembly line',
    proyectoId: 'project-1',
    estado: 'degraded',
    bateria: 45,
    ultimaConexion: new Date(Date.now() - 3600000),
  },
  {
    id: 'node-4',
    nombre: 'Cold Storage Zone 1',
    descripcion: 'Primary cold storage monitoring',
    proyectoId: 'project-2',
    estado: 'online',
    bateria: 95,
    ultimaConexion: new Date(),
  },
  {
    id: 'node-5',
    nombre: 'Cold Storage Zone 2',
    descripcion: 'Secondary cold storage monitoring',
    proyectoId: 'project-2',
    estado: 'offline',
    bateria: 12,
    ultimaConexion: new Date(Date.now() - 7200000),
  },
];

@Injectable({
  providedIn: 'root',
})
export class NodoService {
  private nodesSignal = signal<Nodo[]>(MOCK_NODES);
  private selectedNodoIdSignal = signal<string | null>(null);

  nodes = this.nodesSignal.asReadonly();
  selectedNodoId = this.selectedNodoIdSignal.asReadonly();

  selectNode(id: string | null): void {
    this.selectedNodoIdSignal.set(id);
  }

  getAll(): Nodo[] {
    return this.nodes();
  }

  getByProjectId(projectId: string): Nodo[] {
    return this.nodes().filter((n) => n.proyectoId === projectId);
  }

  getById(id: string): Nodo | undefined {
    return this.nodes().find((n) => n.id === id);
  }

  create(node: Omit<Nodo, 'id'>): Nodo {
    const newNode: Nodo = {
      ...node,
      id: `node-${Date.now()}`,
    };
    console.log('NodeService: Creating node', newNode);
    this.nodesSignal.update((nodes) => [...nodes, newNode]);
    return newNode;
  }

  update(id: string, updates: Partial<Nodo>): Nodo | undefined {
    console.log('NodeService: Updating node', id, updates);
    const node = this.getById(id);
    if (!node) return undefined;

    const updated = { ...node, ...updates };
    this.nodesSignal.update((nodes) => nodes.map((n) => (n.id === id ? updated : n)));
    return updated;
  }

  delete(id: string): boolean {
    console.log('NodeService: Deleting node', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.nodesSignal.update((nodes) => nodes.filter((n) => n.id !== id));
    }
    return exists;
  }
}
