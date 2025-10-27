import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tb_usuarios' })
export class Auth {
  @PrimaryGeneratedColumn({ name: 'u_id', type: 'int' })
  u_id: number;

  @Column({ name: 'u_nombre', type: 'varchar', length: 45 })
  u_nombre: string;

  @Column({ name: 'u_email', type: 'varchar', length: 100, unique: true })
  u_email: string;

  @Column({ name: 'u_contrasena', type: 'varchar', length: 255 })
  u_contrasena: string;

  @Column({ name: 'u_estado', type: 'boolean', default: true })
  u_estado: boolean;

  @Column({ name: 'u_borrado', type: 'boolean', default: false })
  u_borrado: boolean;

  @Column({ name: 'u_creado_en', type: 'timestamptz', default: () => 'NOW()' })
  u_creado_en: Date;

  @Column({ name: 'u_modificado_en', type: 'timestamptz', nullable: true })
  u_modificado_en: Date | null;

  @Column({ name: 'u_borrado_en', type: 'timestamptz', nullable: true })
  u_borrado_en: Date | null;
}
