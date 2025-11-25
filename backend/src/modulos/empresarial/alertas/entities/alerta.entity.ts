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
@Index('idx_alertas_sensor_fecha', ['sensor', 'creadoEn'])
export class Alerta {
    @PrimaryGeneratedColumn({ name: 'a_id', type: 'int' })
    id: number;

    @Column({ name: 'a_mensaje', type: 'varchar', length: 250 })
    mensaje: string;

    @ManyToOne(() => Sensor, { nullable: false, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'a_id_sensor' })
    sensor: Sensor;

    @Column({ name: 'a_estado', type: 'boolean', default: true })
    estado: boolean;

    @Column({ name: 'a_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'a_creado_en', type: 'timestamptz', default: () => 'NOW()' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'a_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'a_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;
}
