import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Alerta } from '../../alertas/entities/alerta.entity';

@Entity('tb_alertas_usuarios')
@Index('idx_au_usuario', ['usuarioId'])
export class AlertaUsuario {
    @PrimaryGeneratedColumn({ name: 'au_id', type: 'int' })
    id: number;

    @ManyToOne(() => Alerta, { nullable: false, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'au_id_alerta' })
    alerta: Alerta;

    @Column({ name: 'au_id_usuario', type: 'int' })
    usuarioId: number;

    @Column({ name: 'au_leido', type: 'boolean', default: false })
    leido: boolean;

    @Column({ name: 'au_leido_en', type: 'timestamptz', nullable: true })
    leidoEn?: Date;

    @Column({ name: 'au_estado', type: 'boolean', default: true })
    estado: boolean;

    @Column({ name: 'au_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'au_creado_en', type: 'timestamptz', default: () => 'NOW()' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'au_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'au_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;
}
