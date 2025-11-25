import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Importación de tipo para evitar dependencia circular fuerte
import { Conexion } from '../../conexiones/entities/conexion.entity';
// Nueva relación a Perfiles (asegúrate de que exista Perfil.entit y su ManyToOne hacia Empresa)
import { Perfil } from '../../perfiles/entities/perfil.entity';

@Entity('tb_empresas')
@Entity('tb_empresas')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'e_id' })
  id: number;

  @Column({ name: 'e_nombre', length: 45 })
  nombre: string;

  @Column({ name: 'e_descripcion', length: 250, nullable: true })
  descripcion?: string;

  @Column({ name: 'e_email', length: 100, nullable: true })
  email?: string;

  @Column({ name: 'e_numero_tel', length: 20, nullable: true })
  numeroTel?: string;

  @Column({ name: 'e_responsable', length: 100, nullable: true })
  responsable?: string;

  @Column({ name: 'e_estado', default: true })
  estado: boolean;

  @Column({ name: 'e_borrado', default: false })
  borrado: boolean;

  @Column({
    name: 'e_creado_en',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  creadoEn: Date;

  @Column({ name: 'e_modificado_en', type: 'timestamptz', nullable: true })
  modificadoEn?: Date;

  @Column({ name: 'e_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;

  @OneToMany(() => Conexion, (conexion) => conexion.empresa)
  conexiones: Conexion[];

  @OneToMany(() => Perfil, (perfil) => perfil.empresa)
  perfiles: Perfil[];
}
