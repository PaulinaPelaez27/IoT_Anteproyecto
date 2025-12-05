import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'u_id' })
  id: number;

  @Column({ name: 'u_nombre', length: 45 })
  nombre: string;

  @Column({ name: 'u_apellido', length: 45, nullable: true })
  apellido?: string;

  @Column({ name: 'u_email', length: 100, unique: true })
  email: string;

  @Column({ name: 'u_contrasena', length: 255 })
  contrasena: string;

  @Column({ name: 'u_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'u_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'u_modificado_en', type: 'timestamptz' })
  modificadoEn?: Date;

  @DeleteDateColumn({ name: 'u_borrado_en', type: 'timestamptz' })
  borradoEn?: Date;

  @OneToMany(() => Perfil, (p) => p.usuario)
  perfiles: Perfil[];
}