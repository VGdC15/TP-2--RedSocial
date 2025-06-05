import { Test, TestingModule } from '@nestjs/testing';
import { AutenticacionService } from './autenticacion.service';

describe('AutenticacionService', () => {
  let service: AutenticacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutenticacionService],
    }).compile();

    service = module.get<AutenticacionService>(AutenticacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
