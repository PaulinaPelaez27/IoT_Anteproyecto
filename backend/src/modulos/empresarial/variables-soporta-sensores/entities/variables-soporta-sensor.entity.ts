import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Sensor } from "../../sensores/entities/sensor.entity";
import { Variable } from "../../variables/entities/variable.entity";

@Entity('tb_variables_soporta_sensores')
export class VariablesSoportaSensor {

  // === PK COMPUESTA ===
  @PrimaryColumn({ name: 'vss_id_sensor', type: 'int' })
  vssIdSensor: number;

  @PrimaryColumn({ name: 'vss_id_variable', type: 'int' })
  vssIdVariable: number;

  // === RELACIONES ===
  @ManyToOne(() => Sensor,{
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vss_id_sensor' })
  sensor: Sensor;

  @ManyToOne(() => Variable, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vss_id_variable' })
  variable: Variable;

  // === COLUMNAS EXTRAS ===
  @Column({ name: 'vss_estado', type: 'boolean', default: true })
  estado: boolean;

  @Column({ name: 'vss_borrado', type: 'boolean', default: false })
  borrado: boolean;

  @Column({ name: 'vss_creado_en', type: 'timestamptz', default: () => 'NOW()' })
  creadoEn: Date;

  @Column({ name: 'vss_modificado_en', type: 'timestamptz', nullable: true })
  modificadoEn: Date;

  @Column({ name: 'vss_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn: Date;
}