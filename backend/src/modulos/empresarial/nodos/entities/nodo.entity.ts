import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Sensor } from '../../sensores/entities/sensor.entity';

@Entity('tb_nodos')
export class Nodo {
  @PrimaryGeneratedColumn({ name: 'n_id', type: 'int' })
  id: number;

  @Column({ name: 'n_nombre', type: 'varchar', length: 45 })
  nombre: string;

  @Column({ name: 'n_ubicacion', type: 'varchar', length: 100, nullable: true })
  ubicacion?: string | null;

  @Column({ name: 'n_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'n_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'n_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'n_borrado_en' })
  borradoEn: Date;

  @Column({ name: 'n_id_proyecto', type: 'int' })
  proyectoId: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.nodos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'n_id_proyecto' })
  proyecto: Proyecto;

  @OneToMany(() => Sensor, (sensor) => sensor.nodo)
  sensores: Sensor[];
}