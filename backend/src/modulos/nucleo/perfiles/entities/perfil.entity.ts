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
@Unique('uq_perfil', ['usuarioId', 'rolId', 'empresaId'])
@Index('idx_perfiles_usuario', ['usuarioId'])
@Index('idx_perfiles_empresa', ['empresaId'])
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'p_id', type: 'int' })
  id: number;

  @Column({ name: 'p_id_usuario', type: 'int' })
  usuarioId: number;

  @ManyToOne(
    () => Auth,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    (u) => (u as any).perfiles,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'p_id_usuario' })
  usuario?: Auth;

  @ManyToOne(
    () => RolUsuario,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    (r) => (r as any).perfiles,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'p_id_rol' })
  rol?: RolUsuario;

  @Column({ name: 'p_id_rol', type: 'int' })
  rolId: number;

  @Column({ name: 'p_id_empresa', type: 'int' })
  empresaId: number;

  @ManyToOne(
    () => Empresa,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    (e) => (e as any).perfiles,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'p_id_empresa' })
  empresa?: Empresa;

  @Column({ name: 'p_estado', type: 'boolean', default: true })
  estado: boolean;

  @Column({ name: 'p_borrado', type: 'boolean', default: false })
  borrado: boolean;

  @CreateDateColumn({ name: 'p_creado_en', type: 'timestamptz' })
  creadoEn: Date;

  @UpdateDateColumn({
    name: 'p_modificado_en',
    type: 'timestamptz',
    nullable: true,
  })
  modificadoEn?: Date;

  @Column({ name: 'p_borrado_en', type: 'timestamptz', nullable: true })
  borradoEn?: Date;
}
