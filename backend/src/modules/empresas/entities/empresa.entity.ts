import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Import tipo para evitar dependencia circular fuerte
import type { Conexion } from '../../conexiones/entities/conexion.entity';

@Entity('tb_empresas')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'e_id', type: 'int' })
  id: number;

  @Column({ name: 'e_nombre', type: 'varchar', length: 100, nullable: true })
  nombre?: string;

  @OneToMany(() => require('../../conexiones/entities/conexion.entity').Conexion, (conexion: any) => conexion.empresa)
  conexiones?: Conexion[];
}
