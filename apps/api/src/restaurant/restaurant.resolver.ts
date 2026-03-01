import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { RestaurantType } from './models/restaurant.type';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { RestaurantListInput } from './dto/restaurant-list.input';
import { PaginatedRestaurant } from './dto/paginated-restaurant';

@Resolver(() => RestaurantType)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => PaginatedRestaurant, { description: '查询餐厅列表' })
  async restaurants(@Args('input') input: RestaurantListInput): Promise<PaginatedRestaurant> {
    return await this.restaurantService.findAll(input);
  }

  @Query(() => [RestaurantType], { description: '查询所有餐厅（不分页）' })
  async findAll(): Promise<RestaurantType[]> {
    return await this.restaurantService.findAllSimple();
  }

  @Query(() => RestaurantType, { nullable: true })
  findOne(@Args('id') id: string): Promise<RestaurantType | null> {
    return this.restaurantService.findOne(id);
  }

  @Mutation(() => RestaurantType)
  createRestaurant(@Args('input') input: CreateRestaurantInput): Promise<RestaurantType> {
    return this.restaurantService.create(input);
  }

  @Mutation(() => RestaurantType)
  updateRestaurant(@Args('id') id: string, @Args('input') input: UpdateRestaurantInput): Promise<RestaurantType> {
    return this.restaurantService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteRestaurant(@Args('id') id: string): Promise<boolean> {
    return this.restaurantService.delete(id);
  }
}
