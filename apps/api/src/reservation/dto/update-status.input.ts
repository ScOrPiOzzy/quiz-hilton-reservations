import { Field, InputType } from '@nestjs/graphql';
import { ReservationStatus } from '../models/reservation.model';
import { IsNotEmpty, IsString, IsOptional, IsEnum, Length } from 'class-validator';

@InputType()
export class UpdateReservationStatusInput {
  @Field(() => String)
  @IsNotEmpty({ message: '预订ID不能为空' })
  @IsString({ message: '预订ID必须是字符串' })
  reservationId: string;

  @Field(() => ReservationStatus)
  @IsEnum(ReservationStatus, { message: '状态值无效' })
  status: ReservationStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '原因必须是字符串' })
  @Length(0, 500, { message: '原因长度不能超过500个字符' })
  reason?: string;
}
