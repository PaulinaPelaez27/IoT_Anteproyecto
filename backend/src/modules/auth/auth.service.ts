import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

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
    const user = await this.authRepository.preload({ u_id: id, ...(updateAuthDto as any) } as any);
    if (!user) throw new NotFoundException('User not found');

    // si actualizan la contraseña, hashéala
    if ((updateAuthDto as any).u_contrasena) {
      user.u_contrasena = await bcrypt.hash((updateAuthDto as any).u_contrasena, 10);
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
}
