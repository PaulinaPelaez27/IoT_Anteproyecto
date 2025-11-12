import { Test, TestingModule } from '@nestjs/testing';
import { DatosCrudosService } from './datos-crudos.service';

describe('DatosCrudosService', () => {
  let service: DatosCrudosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosCrudosService],
    }).compile();

    service = module.get<DatosCrudosService>(DatosCrudosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
