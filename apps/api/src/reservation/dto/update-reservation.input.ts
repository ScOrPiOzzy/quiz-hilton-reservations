import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateReservationInput {
  @Field(() => String)
  reservationId: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => CustomerInput, { nullable: true })
  customer?: CustomerInput;

  @Field(() => String, { nullable: true })
  reservationDate?: string;

  @Field(() => String, { nullable: true })
  storeId?: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

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
}

@InputType()
export class CustomerInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
