import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver } from './restaurant.resolver';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';

@Module({
  providers: [RestaurantResolver, RestaurantService, AreaResolver, AreaService],
  exports: [RestaurantService, AreaService],
})
export class RestaurantModule {}
