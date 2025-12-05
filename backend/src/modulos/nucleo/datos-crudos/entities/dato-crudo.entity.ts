import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity({ name: 'tb_datos_crudos' })
@Index('idx_dc_empresa', ['empresaId'])
@Index('idx_dc_recibido', ['recibidoEn'])
@Index('idx_dc_nodo', ['nodoId'])

export class DatoCrudo {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'dc_id' })
  id: string;

  @Column({ name: 'dc_id_empresa', type: 'int', nullable: true })
  empresaId: number | null;

  @ManyToOne(() => Empresa, (empresa) => empresa.datosCrudos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'dc_id_empresa' })
  empresa: Empresa | null;

  @Column({ name: 'dc_id_nodo', type: 'bigint', nullable: true })
  nodoId: string | null;

  @Column({ name: 'dc_mensaje', type: 'json' })
  mensaje: any;

  @Column({ name: 'dc_recibido_en', type: 'timestamptz' })
  recibidoEn: Date;

  @Column({ name: 'dc_error_log', type: 'text', nullable: true })
  errorLog: string | null;

  @Column({ name: 'dc_estado', type: 'boolean', default: true })
  estado: boolean;

  @UpdateDateColumn({ name: 'dc_modificado_en' })
  modificadoEn: Date | null;

  @DeleteDateColumn({ name: 'dc_borrado_en' })
  borradoEn: Date | null;
}