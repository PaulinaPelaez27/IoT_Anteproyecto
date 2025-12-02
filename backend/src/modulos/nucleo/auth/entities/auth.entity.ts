import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity({ name: 'tb_usuarios' })
@Index('idx_usuario_email', ['email'], { unique: true })
export class Auth {
  @PrimaryGeneratedColumn({ name: 'u_id' })
  id: number;

  @Column({ name: 'u_nombre', length: 45 })
  nombre: string;

  @Column({ name: 'u_email', length: 100})
  email: string;

  @Column({ name: 'u_contrasena', length: 255 })
  contrasena: string;

  @Column({ name: 'u_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'u_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'u_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'u_borrado_en' })
  borradoEn: Date;

  /*
   * MULTI–ROL & MULTI–EMPRESA
   */
  @OneToMany(() => Perfil, (p) => p.usuario)
  perfiles: Perfil[];
}