import { Test, TestingModule } from '@nestjs/testing';
import { ResturantService } from './resturant.service';

describe('ResturantService', () => {
  let service: ResturantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResturantService],
    }).compile();

    service = module.get<ResturantService>(ResturantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
