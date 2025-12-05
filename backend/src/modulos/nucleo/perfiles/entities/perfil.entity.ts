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
  DeleteDateColumn,
} from 'typeorm';

import { Auth } from '../../auth/entities/auth.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { RolUsuario } from 'src/modulos/nucleo/roles-usuarios/entities/rol-usuario.entity';

@Entity('tb_perfiles')
@Unique('uq_perfil', ['usuarioId', 'rolId', 'empresaId'])
@Index('idx_perfiles_usuario', ['usuarioId'])
@Index('idx_perfiles_empresa', ['empresaId'])
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'p_id' })
  id: number;

  /*
   * FK: USUARIO
   */
  @Column({ name: 'p_id_usuario' })
  usuarioId: number;

  @ManyToOne(() => Auth, (u) => u.perfiles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'p_id_usuario' })
  usuario: Auth;

  /*
   * FK: ROL
   */
  @Column({ name: 'p_id_rol' })
  rolId: number;

  @ManyToOne(() => RolUsuario, (r) => r.perfiles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'p_id_rol' })
  rol: RolUsuario;

  /*
   * FK: EMPRESA
   */
  @Column({ name: 'p_id_empresa' })
  empresaId: number;

  @ManyToOne(() => Empresa, (e) => e.perfiles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'p_id_empresa' })
  empresa: Empresa;

  @Column({ name: 'p_estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'p_creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'p_modificado_en' })
  modificadoEn: Date;

  @DeleteDateColumn({ name: 'p_borrado_en' })
  borradoEn: Date;
}