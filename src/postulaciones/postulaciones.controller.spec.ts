import { Test, TestingModule } from '@nestjs/testing';
import { PostulacionesController } from './postulaciones.controller';

describe('PostulacionesController', () => {
  let controller: PostulacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostulacionesController],
    }).compile();

    controller = module.get<PostulacionesController>(PostulacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
