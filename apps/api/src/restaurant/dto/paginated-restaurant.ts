import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RestaurantType } from '../models/restaurant.type';

@ObjectType()
export class PaginatedRestaurant {
  @Field(() => [RestaurantType])
  items: RestaurantType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}
