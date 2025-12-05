import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Unique,
    Index,
    Check,
} from 'typeorm';

import { Sensor } from '../../sensores/entities/sensor.entity';
import { Variable } from '../../variables/entities/variable.entity';

@Entity('tb_umbrales')
@Unique('uq_umbral', ['sensorId', 'variableId'])
@Index('idx_um_sensor_variable', ['sensorId', 'variableId'])
@Check(
  'ck_umbral_rango',
  '(um_valor_min IS NULL OR um_valor_max IS NULL) OR (um_valor_min <= um_valor_max)',
)
@Check(
  'ck_umbral_not_both_null',
  '(um_valor_min IS NOT NULL OR um_valor_max IS NOT NULL)',
)
export class Umbral {
  @PrimaryGeneratedColumn({ name: 'um_id', type: 'int' })
  id: number;

  /*
   * FK SENSOR
   */
  @Column({ name: 'um_id_sensor', type: 'int' })
  sensorId: number;

  @ManyToOne(() => Sensor, (sensor) => sensor.umbrales, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'um_id_sensor' })
  sensor: Sensor;

  /*
   * FK VARIABLE
   */
  @Column({ name: 'um_id_variable', type: 'int' })
  variableId: number;

  @ManyToOne(() => Variable, (variable) => variable.umbrales, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'um_id_variable' })
  variable: Variable;

  @Column({ name: 'um_valor_min', type: 'double precision', nullable: true })
  valorMin?: number;

  @Column({ name: 'um_valor_max', type: 'double precision', nullable: true })
  valorMax?: number;

  @Column({ name: 'um_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'um_creado_en'})
  creadoEn: Date;

  @UpdateDateColumn({ name: 'um_modificado_en' })
  modificadoEn?: Date;

  @DeleteDateColumn({ name: 'um_borrado_en'})
  borradoEn?: Date;
}