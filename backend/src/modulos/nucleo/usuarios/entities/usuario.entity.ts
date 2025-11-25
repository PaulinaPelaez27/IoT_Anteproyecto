import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ name: 'u_estado', default: true })
  estado: boolean;

  @Column({ name: 'u_borrado', default: false })
  borrado: boolean;

  @CreateDateColumn({ name: 'u_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'u_modificado_en', type: 'timestamptz' })
  modificadoEn?: Date;

  @Column({ name: 'u_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;

  @OneToMany(() => Perfil, (p) => p.usuario)
  perfiles: Perfil[];
}
