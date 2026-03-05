import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, Max, MaxLength } from 'class-validator';

@InputType()
export class RestaurantListInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page: number = 1;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  @Max(100, { message: '每页数量不能超过100' })
  pageSize: number = 20;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '酒店ID必须是字符串' })
  hotelId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @MaxLength(100, { message: '搜索关键词长度不能超过100个字符' })
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '类型必须是字符串' })
  type?: string;
}
