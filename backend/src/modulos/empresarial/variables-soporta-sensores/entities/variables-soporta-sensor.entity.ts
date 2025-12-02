import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sensor } from "../../sensores/entities/sensor.entity";
import { Variable } from "../../variables/entities/variable.entity";

@Entity('tb_variables_soporta_sensores')
export class VariablesSoportaSensor {
@PrimaryGeneratedColumn({ name: 'vss_id' })
  id: number; // surrogate primary key

  @Column({ name: 'vss_id_sensor', type: 'int' })
  vssIdSensor: number;

  @Column({ name: 'vss_id_variable', type: 'int' })
  vssIdVariable: number;

  @ManyToOne(() => Sensor, (s) => s.variablesSoportaSensores, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'vss_id_sensor' })
  sensor: Sensor;

  @ManyToOne(() => Variable, (v) => v.variablesSoportaSensores, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'vss_id_variable' })
  variable: Variable;

  @Column({ name: 'vss_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'vss_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'vss_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'vss_borrado_en'})
  borradoEn: Date | null; // borrado lógico real
}