import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Sensor } from '../../sensores/entities/sensor.entity';
import { Variable } from '../../variables/entities/variable.entity';

@Entity('tb_lecturas_sensores')
export class LecturasSensor {
    @PrimaryGeneratedColumn({ name: 'ls_id', type: 'int' })
    id: number;

    @Column({ name: 'ls_valor', type: 'varchar', length: 255 })
    valor: string;

    @Column({ name: 'ls_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'ls_creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'ls_modificado_en' })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'ls_borrado_en'})
    borradoEn?: Date;

    @ManyToOne(() => Sensor, { nullable: false })
    @JoinColumn({ name: 'ls_id_sensor' })
    sensor: Sensor;

    @ManyToOne(() => Variable, { nullable: true })
    @JoinColumn({ name: 'ls_id_variable' })
    variable?: Variable;
}
