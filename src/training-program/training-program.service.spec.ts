import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgramService } from './training-program.service';

describe('TrainingProgramService', () => {
  let service: TrainingProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingProgramService],
    }).compile();

    service = module.get<TrainingProgramService>(TrainingProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
