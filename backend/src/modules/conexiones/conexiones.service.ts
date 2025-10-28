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

  // Los métodos CRUD básicos pueden implementarse según sea necesario; se proporcionan helpers específicos a continuación.
  async create(createConexioneDto: CreateConexioneDto) {
    const ent = this.conexionRepo.create(
      createConexioneDto as Partial<Conexion>,
    );
    return this.conexionRepo.save(ent);
  }

  async findAll() {
    return this.conexionRepo.find({ where: { borrado: false } });
  }

  async findOne(id: number) {
    const e = await this.conexionRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Conexione not found');
    return e;
  }

  async update(id: number, updateConexioneDto: UpdateConexioneDto) {
    const ent = await this.findOne(id);
    Object.assign(ent, updateConexioneDto);
    return this.conexionRepo.save(ent);
  }

  async remove(id: number) {
    const ent = await this.findOne(id);
    ent.borrado = true;
    ent.borradoEn = new Date();
    return this.conexionRepo.save(ent);
  }

  /**
   * Recupera la conexión (fila) en `tb_conexiones` para una empresa determinada.
   * Uso previsto: proporcionar las credenciales/información de conexión para crear/obtener
   * un DataSource hacia la BD tenant.
   */
  async findByEmpresaId(empresaId: number): Promise<Conexion | null> {
    if (!empresaId) throw new Error('empresaId requerido');
    return this.conexionRepo.findOne({
      where: { empresaId, borrado: false },
    });
  }

  /**
   * Ejemplo de ayuda: recupera la fila de conexión E intenta obtener
   * el DataSource tenant mediante TenantConnectionService (si está implementado).
   * Retorna un objeto { conexion, dataSource }.
   */
  async getTenantDataSourceForEmpresaId(empresaId: number): Promise<Conexion> {
    const conexion = await this.findByEmpresaId(empresaId);
    if (!conexion)
      throw new NotFoundException('Conexion para empresa no encontrada');

    return conexion;
  }
}
