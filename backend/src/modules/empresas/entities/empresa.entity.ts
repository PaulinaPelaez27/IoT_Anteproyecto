import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Importación de tipo para evitar dependencia circular fuerte
import { Conexion } from '../../conexiones/entities/conexion.entity';
// Nueva relación a Perfiles (asegúrate de que exista Perfil.entit y su ManyToOne hacia Empresa)
import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity('tb_empresas')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'e_id', type: 'int' })
  id: number;

  @Column({ name: 'e_nombre', type: 'varchar', length: 45, nullable: false })
  nombre: string;

  @Column({
    name: 'e_descripcion',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcion?: string;

  @Column({ name: 'e_email', type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ name: 'e_numero_tel', type: 'varchar', length: 20, nullable: true })
  numeroTel?: string;

  @Column({
    name: 'e_responsable',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  responsable?: string;

  @Column({ name: 'e_estado', type: 'boolean', nullable: false, default: true })
  estado: boolean;

  @Column({
    name: 'e_borrado',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  borrado: boolean;

  @Column({
    name: 'e_creado_en',
    type: 'timestamptz',
    nullable: false,
    default: () => 'NOW()',
  })
  creadoEn: Date;

  @Column({ name: 'e_modificado_en', type: 'timestamptz', nullable: true })
  modificadoEn?: Date;

  @Column({ name: 'e_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;

  @OneToMany(() => Conexion, (conexion: Conexion) => conexion.empresa)
  conexiones?: Conexion[];

  // Relación OneToMany hacia Perfil.
  @OneToMany(() => Perfil, (perfil: Perfil) => perfil.empresa)
  perfiles?: Perfil[];
}
