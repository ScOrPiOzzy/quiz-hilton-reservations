import { Field, InputType } from '@nestjs/graphql';
import { ReservationStatus } from '../models/reservation.model';

@InputType()
export class UpdateReservationStatusInput {
  @Field(() => String)
  reservationId: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field(() => String, { nullable: true })
  reason?: string;
}
