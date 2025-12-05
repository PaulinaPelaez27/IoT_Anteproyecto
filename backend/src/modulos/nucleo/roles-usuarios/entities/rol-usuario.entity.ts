import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity('tb_roles_usuarios')
export class RolUsuario {
  @PrimaryGeneratedColumn({ name: 'ru_id' })
  id: number;

  @Column({ name: 'ru_nombre', unique: true })
  nombre: string;

  @Column({ name: 'ru_descripcion', type: 'text', nullable: true })
  descripcion?: string | null;

  @Column({ name: 'ru_estado', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'ru_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'ru_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'ru_borrado_en' })
  borradoEn: Date;

  @OneToMany(() => Perfil, (p) => p.rol)
  perfiles: Perfil[];
}