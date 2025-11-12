import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('tb_nodos')
export class Nodo {
    @PrimaryGeneratedColumn({ name: 'n_id', type: 'int' })
    id: number;

    @Column({ name: 'n_nombre', type: 'varchar', length: 45 })
    nombre: string;

    @Column({ name: 'n_ubicacion', type: 'varchar', length: 100, nullable: true })
    ubicacion?: string;

    @Column({ name: 'n_estado', type: 'boolean', default: true })
    estado: boolean;

    @Column({ name: 'n_borrado', type: 'boolean', default: false })
    borrado: boolean;

    @CreateDateColumn({ name: 'n_creado_en', type: 'timestamptz' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'n_modificado_en', type: 'timestamptz', nullable: true })
    modificadoEn?: Date;

    @DeleteDateColumn({ name: 'n_borrado_en', type: 'timestamptz', nullable: true })
    borradoEn?: Date;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.nodos, { nullable: true })
    @JoinColumn({ name: 'n_id_proyecto' })
    proyecto?: Proyecto;
}

