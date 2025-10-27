import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tb_datos_crudos' })
export class DatoCrudo {
  // Primary generated BIGINT. Use string to avoid JS precision loss for bigints.
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'dc_id' })
  dc_id: string;

  // If you have an Empresa entity, you can replace this numeric column with a proper relation.
  @Column({ name: 'dc_id_empresa', type: 'int', nullable: true })
  dc_id_empresa: number | null;

  // optional cross-DB id (may be null)
  @Column({ name: 'dc_id_nodo', type: 'bigint', nullable: true })
  dc_id_nodo: string | null;

  // JSONB message, NOT NULL
  @Column({ name: 'dc_mensaje', type: 'jsonb' })
  dc_mensaje: any;

  // timestamptz with default NOW()
  @Column({
    name: 'dc_recibido_en',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  dc_recibido_en: Date;

  @Column({ name: 'dc_error_log', type: 'text', nullable: true })
  dc_error_log: string | null;

  @Column({ name: 'dc_estado', type: 'boolean', default: true })
  dc_estado: boolean;

  @Column({ name: 'dc_borrado', type: 'boolean', default: false })
  dc_borrado: boolean;

  @Column({ name: 'dc_modificado_en', type: 'timestamptz', nullable: true })
  dc_modificado_en: Date | null;

  @Column({ name: 'dc_borrado_en', type: 'timestamptz', nullable: true })
  dc_borrado_en: Date | null;
}
