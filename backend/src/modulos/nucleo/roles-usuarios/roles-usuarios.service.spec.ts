import { Test, TestingModule } from '@nestjs/testing';
import { RolesUsuariosService } from './roles-usuarios.service';

describe('RolesUsuariosService', () => {
  let service: RolesUsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesUsuariosService],
    }).compile();

    service = module.get<RolesUsuariosService>(RolesUsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
