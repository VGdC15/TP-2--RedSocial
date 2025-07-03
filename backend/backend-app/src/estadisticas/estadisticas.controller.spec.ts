import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';

describe('EstadisticasController', () => {
  let controller: EstadisticasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadisticasController],
      providers: [EstadisticasService],
    }).compile();

    controller = module.get<EstadisticasController>(EstadisticasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
