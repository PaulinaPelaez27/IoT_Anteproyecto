import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { UpdateConexioneDto } from './dto/update-conexione.dto';
import { Conexion } from './entities/conexion.entity';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepo: Repository<Conexion>,
  ) {}

  // CRUD stubs can be implemented as needed; provide focused helpers below.
  async create(createConexioneDto: CreateConexioneDto) {
    const ent = this.conexionRepo.create(createConexioneDto as any);
    return this.conexionRepo.save(ent);
  }

  async findAll() {
    return this.conexionRepo.find({ where: { borrado: false } as any });
  }

  async findOne(id: number) {
    const e = await this.conexionRepo.findOne({ where: { id } as any });
    if (!e) throw new NotFoundException('Conexione not found');
    return e;
  }

  async update(id: number, updateConexioneDto: UpdateConexioneDto) {
    const ent = await this.findOne(id);
    Object.assign(ent, updateConexioneDto);
    return this.conexionRepo.save(ent as any);
  }

  async remove(id: number) {
    const ent = await this.findOne(id);
    ent.borrado = true as any;
    ent.borradoEn = new Date() as any;
    return this.conexionRepo.save(ent as any);
  }

  /**
   * Récupère la connexion (row) dans `tb_conexiones` pour une entreprise donnée.
   * Utilisation prévue : fournir les credentials/infos de connexion pour créer/obtenir
   * un DataSource vers la DB tenant.
   */
  async findByEmpresaId(empresaId: number): Promise<Conexion | null> {
    if (!empresaId) throw new Error('empresaId requerido');
    return this.conexionRepo.findOne({
      where: { empresaId, borrado: false } as any,
    });
  }

  /**
   * Exemple d'aide : récupère la ligne de connexion ET tente d'obtenir
   * le DataSource tenant via TenantConnectionService (si implémenté).
   * Retourne un objet { conexion, dataSource }.
   */
  async getTenantDataSourceForEmpresaId(empresaId: number): Promise<Conexion> {
    const conexion = await this.findByEmpresaId(empresaId);
    if (!conexion)
      throw new NotFoundException('Conexion para empresa no encontrada');

    console.log(`Obtained conexion for empresaId=${empresaId}:`, conexion);

    return conexion;
  }
}
