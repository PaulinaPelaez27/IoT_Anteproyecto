import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConnectionService } from '../../common/tenant-connection.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
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
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  /**
   * Devuelve un DataSource inicializado para la empresa del perfil dado.
   * Retorna null si no existe configuración de conexión.
   */
  async getTenantDataSourceForPerfil(perfil: any, entities: Function[] = []) {
    const empresaId =
      perfil.p_id_empresa ?? perfil.empresa?.e_id ?? perfil.empresaId;
    if (!empresaId) return null;
    return this.tenantConnectionService.getDataSourceForEmpresaId(empresaId);
  }

  async create(createAuthDto: CreateAuthDto) {
    // asumimos que createAuthDto tiene u_nombre, u_email, u_contrasena
    const { u_nombre, u_email, u_contrasena } = createAuthDto as any;

    const existing = await this.authRepository.findOne({ where: { u_email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(u_contrasena, 10);

    const user = this.authRepository.create({
      u_nombre,
      u_email,
      u_contrasena: hashed,
    } as Partial<Auth>);

    return this.authRepository.save(user);
  }

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
      ...(updateAuthDto as any),
    } as any);
    if (!user) throw new NotFoundException('User not found');

    // si actualizan la contraseña, hashéala
    if ((updateAuthDto as any).u_contrasena) {
      user.u_contrasena = await bcrypt.hash(
        (updateAuthDto as any).u_contrasena,
        10,
      );
    }

    return this.authRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // borrado lógico: marcar u_borrado = true y u_borrado_en = now
    user.u_borrado = true;
    user.u_borrado_en = new Date();
    return this.authRepository.save(user);
  }

  async login(username: string, password: string) {
    // Cargamos el usuario junto con sus perfiles y datos relacionados (empresa y rol)
    const user = await this.authRepository
      .createQueryBuilder('u')
      // mapear perfiles en la propiedad runtime 'perfiles' (no requiere relación inversa en la entidad)
      .leftJoinAndMapMany(
        'u.perfiles',
        'tb_perfiles',
        'p',
        'p.p_id_usuario = u.u_id AND p.p_borrado = false',
      )
      // mapear empresa relacionada a cada perfil
      .leftJoinAndMapOne(
        'p.empresa',
        'tb_empresas',
        'e',
        'e.e_id = p.p_id_empresa',
      )
      // mapear rol (tabla tb_roles_usuarios)
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

    // Remover contraseña antes de devolver
    const safeUser = { ...user } as any;
    if (safeUser.u_contrasena) delete safeUser.u_contrasena;

    // Para cada perfil recuperado, adjuntamos las conexiones activas de la empresa
    try {
      const perfiles: any[] = (user as any).perfiles ?? [];
      await Promise.all(
        perfiles.map(async (p) => {
          // p may contain p.p_id_empresa or mapped empresa.e_id
          const empresaId = p.p_id_empresa ?? p.empresa?.e_id ?? p.empresaId;
          if (!empresaId) {
            p.conexiones = [];
            return;
          }

          const conexiones = await this.conexionRepository.find({
            where: {
              empresaId,
              borrado: false,
              estado: true,
            },
          });

          p.conexiones = conexiones;
        }),
      );
    } catch (err) {
      // No detener el login si falla la carga de conexiones; devolver al menos el usuario
      // Puedes registrar el error en un logger si lo deseas
    }

    return safeUser;
  }
}
