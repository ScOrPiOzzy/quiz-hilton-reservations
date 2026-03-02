import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

@InputType()
export class CustomerInput {
  @Field(() => String)
  @IsNotEmpty({ message: '客户姓名不能为空' })
  @IsString({ message: '客户姓名必须是字符串' })
  @Length(1, 100, { message: '客户姓名长度必须在1-100个字符之间' })
  name: string;

  @Field(() => String)
  @IsNotEmpty({ message: '电话号码不能为空' })
  @IsString({ message: '电话号码必须是字符串' })
  @Matches(/^[\d\+\-\s()]+$/, { message: '电话号码格式不正确' })
  @Length(5, 20, { message: '电话号码长度必须在5-20个字符之间' })
  phone: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;
}

@InputType()
export class CreateReservationInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '用户ID必须是字符串' })
  userId?: string;

  @Field(() => CustomerInput)
  customer: CustomerInput;

  @Field(() => String)
  @IsNotEmpty({ message: '预订日期不能为空' })
  @IsString({ message: '预订日期必须是字符串' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '预订日期格式不正确，应为 YYYY-MM-DD' })
  reservationDate: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '酒店ID必须是字符串' })
  hotelId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '餐厅ID必须是字符串' })
  restaurantId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '区域ID必须是字符串' })
  areaId?: string;

  @Field(() => String)
  @IsNotEmpty({ message: '时间段不能为空' })
  @IsString({ message: '时间段必须是字符串' })
  timeSlot: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '时间段名称必须是字符串' })
  timeSlotName?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: '用餐人数不能为空' })
  partySize?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '餐桌类型必须是字符串' })
  tableType?: string;

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
