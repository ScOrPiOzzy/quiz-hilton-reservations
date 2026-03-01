import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '../models/reservation.model';

/**
 * 预订查询参数
 * 使用 @ArgsType 封装所有查询条件，提高可维护性
 */
@ArgsType()
export class GetReservationsArgs {
  @Field(() => ReservationStatus, { nullable: true, description: '预订状态' })
  @IsOptional()
  @IsEnum(ReservationStatus, { message: '状态值无效' })
  status?: ReservationStatus;

  @Field(() => String, { nullable: true, description: '用户ID' })
  @IsOptional()
  @IsString({ message: '用户ID必须是字符串' })
  userId?: string;

  @Field(() => String, { nullable: true, description: '店铺ID' })
  @IsOptional()
  @IsString({ message: '店铺ID必须是字符串' })
  storeId?: string;

  @Field(() => String, { nullable: true, description: '电话号码' })
  @IsOptional()
  @IsString({ message: '电话号码必须是字符串' })
  phone?: string;

  @Field(() => String, { nullable: true, description: '客户姓名' })
  @IsOptional()
  @IsString({ message: '客户姓名必须是字符串' })
  name?: string;

  @Field(() => Date, { nullable: true, description: '开始日期' })
  @IsOptional()
  @IsDate({ message: '开始日期必须是有效的日期对象' })
  @Type(() => Date)
  dateFrom?: Date;

  @Field(() => Date, { nullable: true, description: '结束日期' })
  @IsOptional()
  @IsDate({ message: '结束日期必须是有效的日期对象' })
  @Type(() => Date)
  dateTo?: Date;
}
