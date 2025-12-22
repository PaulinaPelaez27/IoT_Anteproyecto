export type NodeStatus = 'online' | 'offline' | 'degraded';

export interface Node {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: NodeStatus;
  battery: number;
  lastSeen: Date;
}
