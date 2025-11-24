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

@Entity('tb_variables')
export class Variable {
    @PrimaryGeneratedColumn({ name: 'v_id', type: 'int' })
    id: number;

    @Column({ name: 'v_nombre', type: 'varchar', length: 100 })
    nombre: string;

    @Column({ name: 'v_unidad', type: 'varchar', length: 15, nullable: true })
    unidad?: string;

    @Column({ name: 'v_descripcion', type: 'varchar', length: 250, nullable: true })
    descripcion?: string;

    @Column({ name: 'v_var_json', type: 'varchar', length: 15, unique: true })
    varJson: string;

    @Column({ name: 'v_estado', type: 'boolean', default: true })
    estado: boolean;

    @Column({ name: 'v_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'v_creado_en', type: 'timestamptz' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'v_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'v_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;

    @OneToMany(() => VariablesSoportaSensor, variableSoportaSensor => variableSoportaSensor.variable)
    variablesSoportaSensores: VariablesSoportaSensor[];

    @OneToMany(() => LecturasSensor, lecturasSensor => lecturasSensor.variable)
    lecturasSensores: LecturasSensor[];
}
