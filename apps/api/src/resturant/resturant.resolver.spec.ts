import { Test, TestingModule } from '@nestjs/testing';
import { ResturantResolver } from './resturant.resolver';
import { ResturantService } from './resturant.service';

describe('ResturantResolver', () => {
  let resolver: ResturantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResturantResolver, ResturantService],
    }).compile();

    resolver = module.get<ResturantResolver>(ResturantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
