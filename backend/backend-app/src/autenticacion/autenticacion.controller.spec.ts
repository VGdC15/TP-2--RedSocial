import { Test, TestingModule } from '@nestjs/testing';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';

describe('AutenticacionController', () => {
  let controller: AutenticacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutenticacionController],
      providers: [AutenticacionService],
    }).compile();

    controller = module.get<AutenticacionController>(AutenticacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
