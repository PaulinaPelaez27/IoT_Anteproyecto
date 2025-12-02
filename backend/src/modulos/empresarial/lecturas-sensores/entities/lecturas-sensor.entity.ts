import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Sensor } from '../../sensores/entities/sensor.entity';
import { Variable } from '../../variables/entities/variable.entity';

@Entity('tb_lecturas_sensores')
@Index('idx_lecturas_sensor', ['sensorId'])
@Index('idx_lecturas_variable', ['variableId'])
@Index('idx_lecturas_fecha', ['creadoEn'])
export class LecturasSensor {
  @PrimaryGeneratedColumn({ name: 'ls_id', type: 'int' })
  id: number;

  @Column({ name: 'ls_valor', type: 'varchar', length: 255 })
  valor: string;

  /*
   * FK: SENSOR
   */
  @Column({ name: 'ls_id_sensor', type: 'int' })
  sensorId: number;

  @ManyToOne(() => Sensor, (sensor) => sensor.lecturasSensores, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ls_id_sensor' })
  sensor: Sensor;

  /*
   * FK: VARIABLE
   */
  @Column({ name: 'ls_id_variable', type: 'int' })
  variableId: number;

  @ManyToOne(() => Variable, (variable) => variable.lecturasSensores, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ls_id_variable' })
  variable: Variable;

  /*
   * ESTADO + SOFT DELETE
   */
  @Column({ name: 'ls_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'ls_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'ls_modificado_en' })
  modificadoEn?: Date;

  @DeleteDateColumn({ name: 'ls_borrado_en' })
  borradoEn?: Date;
}