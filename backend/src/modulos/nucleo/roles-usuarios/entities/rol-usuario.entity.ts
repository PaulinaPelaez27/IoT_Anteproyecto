import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity('tb_roles_usuarios')
export class RolUsuario {
  @PrimaryGeneratedColumn({ name: 'ru_id' })
  id: number;

  @Column({ name: 'ru_nombre', unique: true })
  nombre: string;

  @Column({ name: 'ru_descripcion', nullable: true })
  descripcion?: string;

  @Column({ name: 'ru_estado', default: true })
  estado: boolean;

  @Column({ name: 'ru_borrado', default: false })
  borrado: boolean;

  @OneToMany(() => Perfil, (p) => p.rol)
  perfiles: Perfil[];
}

