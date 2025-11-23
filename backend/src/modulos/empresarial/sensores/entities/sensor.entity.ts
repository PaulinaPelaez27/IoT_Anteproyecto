import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";

import { Nodo } from "../../nodos/entities/nodo.entity";
import { VariablesSoportaSensor } from "../../variables-soporta-sensores/entities/variables-soporta-sensor.entity";

@Entity('tb_sensores')

export class Sensor {

    @PrimaryGeneratedColumn({ name: 's_id', type: 'int' })
    id: number;

    @Column({ name: 's_nombre', type: 'varchar', length: 45, nullable: false })
    nombre: string;

    @Column({ name: 's_estado', type: 'boolean', nullable: false, default: true })
    estado: boolean;

    @Column({ name: 's_borrado', type: 'boolean', nullable: false, default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 's_creado_en', type: 'timestamptz', nullable: false, default: () => 'NOW()' })
    creadoEn?: Date;

    @UpdateDateColumn({ name: 's_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 's_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;

    @ManyToOne(() => Nodo, nodo => nodo.sensores, { nullable: false })
    @JoinColumn({ name: 's_id_nodo' })
    nodo: Nodo;

    @OneToMany(() => VariablesSoportaSensor, variableSoportaSensor => variableSoportaSensor.sensor)
    variablesSoportaSensores: VariablesSoportaSensor[];
}