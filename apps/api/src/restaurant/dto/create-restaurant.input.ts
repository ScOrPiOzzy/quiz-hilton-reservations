import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateRestaurantInput {
  @Field(() => String)
  @IsNotEmpty({ message: '餐厅名称不能为空' })
  @IsString({ message: '餐厅名称必须是字符串' })
  name: string;

  @Field(() => String)
  @IsNotEmpty({ message: '餐厅类型不能为空' })
  @IsString({ message: '餐厅类型必须是字符串' })
  type: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '菜系必须是字符串' })
  cuisine?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: '容量必须是整数' })
  capacity?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '营业时间必须是字符串' })
  openingHours?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '酒店ID必须是字符串' })
  hotelId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '位置必须是字符串' })
  location?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;
}
