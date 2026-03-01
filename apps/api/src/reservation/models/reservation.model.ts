import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

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
}

export type { IReservation } from '../repositories/reservation.repository';
