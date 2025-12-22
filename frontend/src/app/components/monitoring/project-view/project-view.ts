import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { NodeService } from '../../../services/node.service';
import { SensorService } from '../../../services/sensor.service';
import { Button } from '../../../shared/ui';
import { LucideAngularModule, Pencil, Trash } from 'lucide-angular';

@Component({
  selector: 'app-project-view',
  imports: [CommonModule, RouterModule, Button, LucideAngularModule],
  templateUrl: './project-view.html',
  styleUrls: ['./project-view.css'],
})
export class ProjectView {
  projectService = inject(ProjectService);
  nodeService = inject(NodeService);
  sensorService = inject(SensorService);
  route = inject(ActivatedRoute);

  projectId = this.projectService.selectedProjectId;
  selectedNodeId = signal<string | null>(null);

  // icons
  readonly pencilIcon = Pencil;
  readonly trashIcon = Trash;

  project = computed(() => {
    const id = this.projectId();
    return id ? this.projectService.getById(id) : undefined;
  });

  nodes = computed(() => {
    const id = this.projectId();
    return id ? this.nodeService.getByProjectId(id) : [];
  });

  selectedNode = computed(() => {
    const nodeId = this.selectedNodeId();
    return nodeId ? this.nodeService.getById(nodeId) : this.nodes()[0];
  });

  sensors = computed(() => {
    const node = this.selectedNode();
    return node ? this.sensorService.getByNodeId(node.id) : [];
  });

  selectNode(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
  }

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
}
