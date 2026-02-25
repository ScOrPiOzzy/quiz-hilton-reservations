import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';

@Resolver('Restaurant')
export class RestaurantResolver {
  constructor(private readonly RestaurantService: RestaurantService) {}

  @Mutation('createRestaurant')
  create(
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
  ) {
    return this.RestaurantService.create(createRestaurantInput);
  }

  @Query('Restaurant')
  findAll() {
    return this.RestaurantService.findAll();
  }

  @Query('Restaurant')
  findOne(@Args('id') id: number) {
    return this.RestaurantService.findOne(id);
  }

  @Mutation('updateRestaurant')
  update(
    @Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput,
  ) {
    return this.RestaurantService.update(
      updateRestaurantInput.id,
      updateRestaurantInput,
    );
  }

  @Mutation('removeRestaurant')
  remove(@Args('id') id: number) {
    return this.RestaurantService.remove(id);
  }
}
