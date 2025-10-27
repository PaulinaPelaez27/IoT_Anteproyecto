import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConnectionHelper } from 'src/common/tenant-helpers';
import * as bcrypt from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import { Conexion } from '../conexiones/entities/conexion.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Conexion)
    private readonly conexionRepository: Repository<Conexion>,
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) {}

  async findAll() {
    return this.authRepository.find();
  }

  async findOne(id: number) {
    const user = await this.authRepository.findOne({ where: { u_id: id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.authRepository.findOne({ where: { u_email: email } });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    const user = await this.authRepository.preload({
      u_id: id,
      ...updateAuthDto,
    } as Partial<Auth>);
    if (!user) throw new NotFoundException('User not found');

    // Si actualizan la contraseña, hashéala
    if ('u_contrasena' in updateAuthDto) {
      const dto = updateAuthDto as unknown as { u_contrasena: string };
      user.u_contrasena = await bcrypt.hash(dto.u_contrasena, 10);
    }

    return this.authRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // Borrado lógico: marcar u_borrado = true y u_borrado_en = now
    user.u_borrado = true;
    user.u_borrado_en = new Date();
    return this.authRepository.save(user);
  }

  async login(username: string, password: string) {
    // Cargamos el usuario junto con sus perfiles y datos relacionados (empresa y rol)
    const user = await this.authRepository
      .createQueryBuilder('u')
      // Mapear perfiles en la propiedad runtime 'perfiles' (no requiere relación inversa en la entidad)
      .leftJoinAndMapMany(
        'u.perfiles',
        'tb_perfiles',
        'p',
        'p.p_id_usuario = u.u_id AND p.p_borrado = false',
      )
      // Mapear empresa relacionada a cada perfil
      .leftJoinAndMapOne(
        'p.empresa',
        'tb_empresas',
        'e',
        'e.e_id = p.p_id_empresa',
      )
      // Mapear rol (tabla tb_roles_usuarios)
      .leftJoinAndMapOne(
        'p.rol',
        'tb_roles_usuarios',
        'r',
        'r.ru_id = p.p_id_rol',
      )
      .where('u.u_email = :email', { email: username })
      .andWhere('u.u_borrado = false')
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(password, user.u_contrasena);
    if (!isMatch) throw new ConflictException('Invalid credentials');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const safeUser = { ...user } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (safeUser.u_contrasena) delete safeUser.u_contrasena;

    // Para cada perfil recuperado, adjuntamos las conexiones activas de la empresa
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const perfiles: any[] = (user as any).perfiles ?? [];
      await Promise.all(
        perfiles.map(async (p) => {
          // p puede contener p.p_id_empresa o empresa.e_id mapeado
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const empresaId = p.p_id_empresa ?? p.empresa?.e_id ?? p.empresaId;
          if (!empresaId) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            p.conexiones = [];
            return;
          }

          const conexiones = await this.conexionRepository.find({
            where: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              empresaId,
              borrado: false,
              estado: true,
            },
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          p.conexiones = conexiones;
        }),
      );
    } catch {
      // No detener el login si falla la carga de conexiones; devolver al menos el usuario
      // Puedes registrar el error en un logger si lo deseas
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return safeUser;
  }
}
