import { Test, TestingModule } from '@nestjs/testing';
import { ConexionesController } from './conexiones.controller';
import { ConexionesService } from './conexiones.service';

describe('ConexionesController', () => {
  let controller: ConexionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConexionesController],
      providers: [ConexionesService],
    }).compile();

    controller = module.get<ConexionesController>(ConexionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
