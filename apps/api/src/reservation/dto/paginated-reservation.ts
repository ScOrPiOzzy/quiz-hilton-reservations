import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ReservationType } from '../models/reservation.model';

@ObjectType()
export class PaginatedReservation {
  @Field(() => [ReservationType])
  items: ReservationType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}
