import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

import { Sensor } from '../../sensores/entities/sensor.entity';

@Entity('tb_alertas')
@Index('idx_alertas_sensor_fecha', ['sensorId', 'creadoEn'])
export class Alerta {
  @PrimaryGeneratedColumn({ name: 'a_id', type: 'int' })
  id: number;

  @Column({ name: 'a_mensaje', type: 'varchar', length: 250 })
  mensaje: string;

  /*
   * FK EXPLÍCITA
   */
  @Column({ name: 'a_id_sensor' })
  sensorId: number;

  /*
   * RELACIÓN COMPLETA
   */
  @ManyToOne(() => Sensor, (sensor) => sensor.alertas, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'a_id_sensor' })
  sensor: Sensor;

  /*
   * CONTROL OPERATIVO
   */
  @Column({ name: 'a_estado', type: 'boolean', default: true })
  estado: boolean;

  /*
   * TIMESTAMPS
   */
  @CreateDateColumn({ name: 'a_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'a_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'a_borrado_en' })
  borradoEn: Date;
}
