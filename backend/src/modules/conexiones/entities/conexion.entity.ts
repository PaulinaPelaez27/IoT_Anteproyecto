import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Ajusta la ruta si la entidad Empresa está en otra ubicación
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('tb_conexiones')
export class Conexion {
  @PrimaryGeneratedColumn({ name: 'c_id', type: 'int' })
  id: number;

  @Column({ name: 'c_id_empresa', type: 'int' })
  empresaId: number;

  @ManyToOne(
    () => Empresa,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    (empresa) => (empresa as any).conexiones,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'c_id_empresa' })
  empresa?: Empresa;

  @Column({ name: 'c_host', type: 'varchar', length: 100, nullable: true })
  host?: string;

  @Column({ name: 'c_puerto', type: 'int', nullable: true })
  puerto?: number;

  @Column({ name: 'c_nombre_base_de_datos', type: 'varchar', length: 45 })
  nombreBaseDeDatos: string;

  @Column({ name: 'c_usuario', type: 'varchar', length: 45 })
  usuario: string;

  @Column({ name: 'c_contrasena', type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ name: 'c_estado', type: 'boolean', default: true })
  estado: boolean;

  @Column({ name: 'c_borrado', type: 'boolean', default: false })
  borrado: boolean;

  @CreateDateColumn({ name: 'c_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({
    name: 'c_modificado_en',
    type: 'timestamptz',
    nullable: true,
  })
  modificadoEn?: Date;

  @Column({ name: 'c_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;
}
