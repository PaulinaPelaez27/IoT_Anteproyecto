import { Test, TestingModule } from '@nestjs/testing';
import { ConexionesService } from './conexiones.service';

describe('ConexionesService', () => {
  let service: ConexionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConexionesService],
    }).compile();

    service = module.get<ConexionesService>(ConexionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
