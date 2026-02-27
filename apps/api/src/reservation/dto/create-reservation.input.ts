import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => CustomerInput)
  customer: CustomerInput;

  @Field(() => String)
  reservationDate: string;

  @Field(() => String, { nullable: true })
  storeId?: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

  @Field(() => String)
  timeSlot: string;

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
