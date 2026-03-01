import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';
import { CustomerInput } from './create-reservation.input';

@InputType()
export class UpdateReservationInput {
  @Field(() => String)
  @IsNotEmpty({ message: '预订ID不能为空' })
  @IsString({ message: '预订ID必须是字符串' })
  reservationId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '用户ID必须是字符串' })
  userId?: string;

  @Field(() => CustomerInput, { nullable: true })
  @IsOptional()
  customer?: CustomerInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '预订日期必须是字符串' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '预订日期格式不正确，应为 YYYY-MM-DD' })
  reservationDate?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '店铺ID必须是字符串' })
  storeId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '店铺名称必须是字符串' })
  storeName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '时间段必须是字符串' })
  timeSlot?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '时间段名称必须是字符串' })
  timeSlotName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '餐桌配置ID必须是字符串' })
  tableConfigId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '餐桌配置名称必须是字符串' })
  tableConfigName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '特殊要求必须是字符串' })
  @Length(0, 500, { message: '特殊要求长度不能超过500个字符' })
  specialRequests?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '预计到达时间必须是字符串' })
  @Matches(/^\d{2}:\d{2}$/, { message: '预计到达时间格式不正确，应为 HH:MM' })
  estimatedArrivalTime?: string;
}
