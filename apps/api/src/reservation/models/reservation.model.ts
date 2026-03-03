import { ObjectType, Field, registerEnumType, Int } from '@nestjs/graphql';
import { HotelType } from '@/hotel/models/hotel.type';
import { RestaurantType } from '@/restaurant/models/restaurant.type';
import { AreaType } from '@/restaurant/models/area.type';

export enum ReservationStatus {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
  description: '预订状态',
});

@ObjectType()
export class CustomerType {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@ObjectType()
export class ReservationType {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  storeId?: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

  @Field(() => String)
  reservationDate: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field(() => CustomerType)
  customer: CustomerType;

  @Field(() => String, { nullable: true })
  timeSlot?: string;

  @Field(() => String, { nullable: true })
  timeSlotName?: string;

  @Field(() => Int, { nullable: true })
  partySize?: number;

  @Field(() => String, { nullable: true })
  tableType?: string;

  @Field(() => String, { nullable: true })
  tableConfigId?: string;

  @Field(() => String, { nullable: true })
  tableConfigName?: string;

  @Field(() => String, { nullable: true })
  specialRequests?: string;

  @Field(() => String, { nullable: true })
  estimatedArrivalTime?: string;

  @Field(() => String, { nullable: true })
  hotelId?: string;

  @Field(() => String, { nullable: true })
  restaurantId?: string;

  @Field(() => String, { nullable: true })
  areaId?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;

  @Field(() => RestaurantType, { nullable: true })
  restaurant?: RestaurantType;

  @Field(() => HotelType, { nullable: true })
  hotel?: HotelType;

  @Field(() => AreaType, { nullable: true })
  area?: AreaType;

  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => String, { nullable: true })
  verifiedAt?: string;

  @Field(() => String, { nullable: true })
  confirmedAt?: string;

  @Field(() => String, { nullable: true })
  confirmedBy?: string;

  @Field(() => String, { nullable: true })
  completedAt?: string;

  @Field(() => String, { nullable: true })
  cancelledAt?: string;

  @Field(() => String, { nullable: true })
  cancelReason?: string;

  @Field(() => String, { nullable: true })
  cancelledBy?: string;
}

export type { IReservation } from '../repositories/reservation.repository';
