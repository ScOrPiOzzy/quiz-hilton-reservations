import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantResolver } from './resturant.resolver';

@Module({
  providers: [ResturantResolver, ResturantService],
})
export class ResturantModule {}
