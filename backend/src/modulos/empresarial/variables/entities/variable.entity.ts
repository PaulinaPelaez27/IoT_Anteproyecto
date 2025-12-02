import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';

import { VariablesSoportaSensor } from '../../variables-soporta-sensores/entities/variables-soporta-sensor.entity';
import { LecturasSensor } from '../../lecturas-sensores/entities/lecturas-sensor.entity';
import { Umbral } from '../../umbrales/entities/umbral.entity';

@Entity('tb_variables')
export class Variable {
  @PrimaryGeneratedColumn({ name: 'v_id', type: 'int' })
  id: number;

  @Column({ name: 'v_nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'v_unidad', type: 'varchar', length: 15, nullable: true })
  unidad?: string | null;

  @Column({ name: 'v_descripcion', type: 'varchar', length: 250, nullable: true })
  descripcion?: string | null;

  @Column({ name: 'v_var_json', type: 'varchar', length: 100, unique: true })
  varJson: string;

  @Column({ name: 'v_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'v_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'v_modificado_en' })
  modificadoEn?: Date;

  @DeleteDateColumn({ name: 'v_borrado_en' })
  borradoEn?: Date;

  @OneToMany(
    () => VariablesSoportaSensor,
    (variableSoportaSensor) => variableSoportaSensor.variable,
  )
  variablesSoportaSensores: VariablesSoportaSensor[];

  @OneToMany(() => LecturasSensor, (lecturasSensor) => lecturasSensor.variable)
  lecturasSensores: LecturasSensor[];

  @OneToMany(() => Umbral, (umbral) => umbral.variable)
  umbrales: Umbral[];
}