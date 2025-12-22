import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { NodeService } from '../../../services/node.service';
import { SensorService } from '../../../services/sensor.service';
import { ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-project-view',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './project-view.html',
  styleUrl: './project-view.css',
})
export class ProjectView {
  projectId = signal<string>('');
  selectedNodeId = signal<string | null>(null);

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

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private nodeService: NodeService,
    private sensorService: SensorService
  ) {
    this.route.params.subscribe((params) => {
      if (params['projectId']) {
        this.projectId.set(params['projectId']);
        // Auto-select first node
        const nodes = this.nodeService.getByProjectId(params['projectId']);
        if (nodes.length > 0 && !this.selectedNodeId()) {
          this.selectedNodeId.set(nodes[0].id);
        }
      }
      if (params['nodeId']) {
        this.selectedNodeId.set(params['nodeId']);
      }
    });
  }

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
