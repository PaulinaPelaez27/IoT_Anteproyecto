import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('tb_conexiones')
@Index('idx_conexiones_empresa', ['empresaId'])
export class Conexion {
  @PrimaryGeneratedColumn({ name: 'c_id' })
  id: number;

  @Column({ name: 'c_id_empresa' })
  empresaId: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.conexiones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'c_id_empresa' })
  empresa: Empresa;

  @Column({ name: 'c_host', length: 100, nullable: true })
  host?: string;

  @Column({ name: 'c_puerto', type: 'int', nullable: true })
  puerto?: number;

  @Column({ name: 'c_nombre_base_de_datos', length: 45 })
  nombreBaseDeDatos: string;

  @Column({ name: 'c_usuario', length: 45 })
  usuario: string;

  @Column({ name: 'c_contrasena', length: 255 })
  contrasena: string;

  @Column({ name: 'c_estado', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'c_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'c_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'c_borrado_en' })
  borradoEn: Date;
}