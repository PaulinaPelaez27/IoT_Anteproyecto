import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

import { Auth } from '../../auth/entities/auth.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { RolUsuario } from 'src/modulos/nucleo/roles-usuarios/entities/rol-usuario.entity';

@Entity('tb_perfiles')
@Unique('uq_perfil', ['usuario', 'rol', 'empresa'])
@Index('idx_perfiles_usuario', ['usuario'])
@Index('idx_perfiles_empresa', ['empresa'])

export class Perfil {
   @PrimaryGeneratedColumn({ name: 'p_id' })
  id: number;

  /*
   * RELACIÓN CON USUARIO GLOBAL
   */
  @ManyToOne(() => Auth, (u) => u.perfiles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: false,     // para cargar manualmente cuando se necesite
  })
  @JoinColumn({ name: 'p_id_usuario' })
  usuario: Auth;

  @Column({ name: 'p_id_usuario' })
  usuarioId: number;

  /*
   * RELACIÓN CON ROL GLOBAL
   */
  @ManyToOne(() => RolUsuario, (r) => r.perfiles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'p_id_rol' })
  rol: RolUsuario;

  @Column({ name: 'p_id_rol' })
  rolId: number;

  /*
   * RELACIÓN CON EMPRESA
   */
  @ManyToOne(() => Empresa, (e) => e.perfiles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'p_id_empresa' })
  empresa: Empresa;

  @Column({ name: 'p_id_empresa' })
  empresaId: number;

  /*
   * ESTADOS Y METADATA
   */
  @Column({ name: 'p_estado', type: 'boolean', default: true })
  estado: boolean;

  @Column({ name: 'p_borrado', type: 'boolean', default: false })
  borrado: boolean;

  @CreateDateColumn({ name: 'p_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'p_modificado_en', type: 'timestamptz', nullable: true })
  modificadoEn?: Date;

  @Column({ name: 'p_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;
}
