// src/app/features/empresas/models/empresa.model.ts

export interface Empresa {
  id: number;
  nombre: string;
  descripcion?: string | null;
  email: string;
  numeroTel?: string | null;
  responsable?: string | null;
  estado: boolean;
}
