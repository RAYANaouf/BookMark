import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgramController } from './training-program.controller';

describe('TrainingProgramController', () => {
  let controller: TrainingProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingProgramController],
    }).compile();

    controller = module.get<TrainingProgramController>(TrainingProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
