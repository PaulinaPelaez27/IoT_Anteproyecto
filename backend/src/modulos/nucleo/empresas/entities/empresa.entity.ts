import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Conexion } from '../../conexiones/entities/conexion.entity';
import { Perfil } from '../../perfiles/entities/perfil.entity';
import { DatoCrudo } from '../../datos-crudos/entities/dato-crudo.entity';

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

  @CreateDateColumn({ name: 'e_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'e_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'e_borrado_en' })
  borradoEn: Date;

  @OneToMany(() => Conexion, (conexion) => conexion.empresa)
  conexiones: Conexion[];

  @OneToMany(() => Perfil, (perfil) => perfil.empresa)
  perfiles: Perfil[];

  @OneToMany(() => DatoCrudo, (dc) => dc.empresa)
  datosCrudos: DatoCrudo[];


}