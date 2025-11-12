import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_roles_usuarios' })
export class RolUsuario {
  @PrimaryGeneratedColumn({ name: 'ru_id', type: 'int' })
  ru_id: number;

  @Column({ name: 'ru_nombre', type: 'varchar', length: 45, unique: true })
  ru_nombre: string;

  @Column({
    name: 'ru_descripcion',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  ru_descripcion?: string;

  @Column({ name: 'ru_estado', type: 'boolean', default: true })
  ru_estado: boolean;

  @Column({ name: 'ru_borrado', type: 'boolean', default: false })
  ru_borrado: boolean;

  @CreateDateColumn({
    name: 'ru_creado_en',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  ru_creado_en: Date;

  @UpdateDateColumn({
    name: 'ru_modificado_en',
    type: 'timestamptz',
    nullable: true,
  })
  ru_modificado_en?: Date;

  @Column({ name: 'ru_borrado_en', type: 'timestamptz', nullable: true })
  ru_borrado_en?: Date;
}
