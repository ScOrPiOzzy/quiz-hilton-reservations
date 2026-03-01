import { ObjectType, Field, Int } from '@nestjs/graphql';
import { HotelType } from '../models/hotel.type';

@ObjectType()
export class PaginatedHotel {
  @Field(() => [HotelType])
  items: HotelType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}
