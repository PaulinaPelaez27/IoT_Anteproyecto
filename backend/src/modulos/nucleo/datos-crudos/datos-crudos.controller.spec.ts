import { Test, TestingModule } from '@nestjs/testing';
import { DatosCrudosController } from './datos-crudos.controller';
import { DatosCrudosService } from './datos-crudos.service';

describe('DatosCrudosController', () => {
  let controller: DatosCrudosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosCrudosController],
      providers: [DatosCrudosService],
    }).compile();

    controller = module.get<DatosCrudosController>(DatosCrudosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
