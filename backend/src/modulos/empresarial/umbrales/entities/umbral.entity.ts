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
@Unique('uq_umbral', ['sensor', 'variable'])
@Index('idx_um_sensor_variable', ['sensor', 'variable'])
@Check(
    'ck_umbral_rango',
    '(um_valor_min IS NULL OR um_valor_max IS NULL) OR (um_valor_min <= um_valor_max)',
)
@Check(
  'ck_umbral_not_both_null',
  '(um_valor_min IS NOT NULL OR um_valor_max IS NOT NULL)'
)

export class Umbral {
    @PrimaryGeneratedColumn({ name: 'um_id', type: 'int' })
    id: number;

    @ManyToOne(() => Sensor, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'um_id_sensor' })
    sensor: Sensor;

    @ManyToOne(() => Variable, { nullable: false, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'um_id_variable' })
    variable: Variable;

    @Column({ name: 'um_valor_min', type: 'double precision', nullable: true })
    valorMin?: number;

    @Column({ name: 'um_valor_max', type: 'double precision', nullable: true })
    valorMax?: number;

    @Column({ name: 'um_estado', type: 'boolean', default: true })
    estado: boolean;

    @Column({ name: 'um_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'um_creado_en', type: 'timestamptz', default: () => 'NOW()' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'um_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'um_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;
}
