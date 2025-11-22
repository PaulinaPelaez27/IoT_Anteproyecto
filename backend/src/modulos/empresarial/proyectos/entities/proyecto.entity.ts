import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Nodo } from '../../nodos/entities/nodo.entity';

@Entity('tb_proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn({ name: 'p_id', type: 'int' })
  id: number;

  @Column({ name: 'p_nombre', type: 'varchar', length: 45 })
  nombre: string;

  @Column({
    name: 'p_descripcion',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcion?: string;

  @Column({ name: 'p_estado', type: 'boolean', default: true })
  estado: boolean;

  @Column({ name: 'p_borrado', type: 'boolean', default: false })
  borrado: boolean;

  @CreateDateColumn({ name: 'p_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({
    name: 'p_modificado_en',
    type: 'timestamptz',
    nullable: true,
  })
  modificadoEn?: Date;

  @DeleteDateColumn({ name: 'p_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;

  @OneToMany(() => Nodo, nodo => nodo.proyecto)
  nodos: Nodo[];
}
