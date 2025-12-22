import { Injectable, signal } from '@angular/core';
import { Node } from '../models/node.model';

const MOCK_NODES: Node[] = [
  {
    id: 'node-1',
    name: 'Production Line A',
    description: 'Main production line sensors',
    projectId: 'project-1',
    status: 'online',
    battery: 87,
    lastSeen: new Date()
  },
  {
    id: 'node-2',
    name: 'Quality Control Station',
    description: 'Quality monitoring sensors',
    projectId: 'project-1',
    status: 'online',
    battery: 92,
    lastSeen: new Date()
  },
  {
    id: 'node-3',
    name: 'Assembly Line B',
    description: 'Secondary assembly line',
    projectId: 'project-1',
    status: 'degraded',
    battery: 45,
    lastSeen: new Date(Date.now() - 3600000)
  },
  {
    id: 'node-4',
    name: 'Cold Storage Zone 1',
    description: 'Primary cold storage monitoring',
    projectId: 'project-2',
    status: 'online',
    battery: 95,
    lastSeen: new Date()
  },
  {
    id: 'node-5',
    name: 'Cold Storage Zone 2',
    description: 'Secondary cold storage monitoring',
    projectId: 'project-2',
    status: 'offline',
    battery: 12,
    lastSeen: new Date(Date.now() - 7200000)
  }
];

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private nodesSignal = signal<Node[]>(MOCK_NODES);

  nodes = this.nodesSignal.asReadonly();

  getAll(): Node[] {
    return this.nodes();
  }

  getByProjectId(projectId: string): Node[] {
    return this.nodes().filter(n => n.projectId === projectId);
  }

  getById(id: string): Node | undefined {
    return this.nodes().find(n => n.id === id);
  }

  create(node: Omit<Node, 'id'>): Node {
    const newNode: Node = {
      ...node,
      id: `node-${Date.now()}`
    };
    console.log('NodeService: Creating node', newNode);
    this.nodesSignal.update(nodes => [...nodes, newNode]);
    return newNode;
  }

  update(id: string, updates: Partial<Node>): Node | undefined {
    console.log('NodeService: Updating node', id, updates);
    const node = this.getById(id);
    if (!node) return undefined;

    const updated = { ...node, ...updates };
    this.nodesSignal.update(nodes =>
      nodes.map(n => n.id === id ? updated : n)
    );
    return updated;
  }

  delete(id: string): boolean {
    console.log('NodeService: Deleting node', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.nodesSignal.update(nodes =>
        nodes.filter(n => n.id !== id)
      );
    }
    return exists;
  }
}
