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
import { Perfil } from '../perfiles/entities/perfil.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

// jwt token
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Conexion)
    private readonly conexionRepository: Repository<Conexion>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly tenantConnectionHelper: TenantConnectionHelper,
    private readonly jwtService: JwtService,
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

  /*
   * Autenticación y generación de JWT
   */
  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.authRepository.findOne({
      where: { u_email: username, u_borrado: false },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.u_contrasena);
    if (!isMatch) throw new ConflictException('Credenciales inválidas');

    const safeUser = {
      id: user.u_id,
      nombre: user.u_nombre,
      email: user.u_email,
      empresa: '',
      rol: '',
    } as LoginResponseDto;

    try {
      const perfiles = await this.perfilRepository.find({
        where: { usuarioId: user.u_id, borrado: false },
        relations: ['empresa', 'rol'],
      });

      if (perfiles && perfiles.length > 0) {
        safeUser.empresa = perfiles[0].empresa?.nombre || '';
        safeUser.rol = perfiles[0].rol?.ru_nombre || '';
      }

      // Generar el JWT
      const payload: JwtPayload = {
        sub: user.u_id,
        email: user.u_email,
        empresa: safeUser.empresa,
        rol: safeUser.rol,
      };

      safeUser.access_token = this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error fetching empresa info during login:', error);
    }

    return safeUser;
  }
}
