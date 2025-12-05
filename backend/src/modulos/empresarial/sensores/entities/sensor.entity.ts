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
import { LecturasSensor } from "../../lecturas-sensores/entities/lecturas-sensor.entity";
import { Umbral } from "../../umbrales/entities/umbral.entity";
import { Alerta } from "../../alertas/entities/alerta.entity";

@Entity('tb_sensores')
export class Sensor {

    @PrimaryGeneratedColumn({ name: 's_id', type: 'int' })
    id: number;

    @Column({ name: 's_nombre', type: 'varchar', length: 45 })
    nombre: string;

    @Column({ name: 's_estado', type: 'boolean', default: true })
    estado: boolean;

    @CreateDateColumn({ name: 's_creado_en' })
    creadoEn?: Date;

    @UpdateDateColumn({ name: 's_modificado_en' })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 's_borrado_en' })
    borradoEn?: Date;

    @Column({ name: 's_id_nodo', type: 'int' })
    nodoId: number;

    @ManyToOne(() => Nodo, (nodo) => nodo.sensores, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 's_id_nodo' })
    nodo: Nodo;

    @OneToMany(() => VariablesSoportaSensor, (vss) => vss.sensor)
    variablesSoportaSensores: VariablesSoportaSensor[];

    @OneToMany(() => LecturasSensor, (ls) => ls.sensor)
    lecturasSensores: LecturasSensor[];

    @OneToMany(() => Umbral, (u) => u.sensor)
    umbrales: Umbral[];

    @OneToMany(() => Alerta, (alerta) => alerta.sensor)
    alertas: Alerta[];

}