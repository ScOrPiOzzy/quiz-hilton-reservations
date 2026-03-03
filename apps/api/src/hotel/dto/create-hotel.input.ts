import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsInt, IsArray, IsUrl, Min, Max, Length, Matches } from 'class-validator';

@InputType()
export class CreateHotelInput {
  @Field(() => String)
  @IsNotEmpty({ message: '酒店名称不能为空' })
  @IsString({ message: '酒店名称必须是字符串' })
  @Length(1, 200, { message: '酒店名称长度必须在1-200个字符之间' })
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @Length(0, 2000, { message: '描述长度不能超过2000个字符' })
  description?: string;

  @Field(() => String)
  @IsNotEmpty({ message: '地址不能为空' })
  @IsString({ message: '地址必须是字符串' })
  @Length(1, 500, { message: '地址长度必须在1-500个字符之间' })
  address: string;

  @Field(() => String)
  @IsNotEmpty({ message: '城市不能为空' })
  @IsString({ message: '城市必须是字符串' })
  @Length(1, 100, { message: '城市名称长度必须在1-100个字符之间' })
  city: string;

  @Field(() => String)
  @IsNotEmpty({ message: '国家不能为空' })
  @IsString({ message: '国家必须是字符串' })
  @Length(1, 100, { message: '国家名称长度必须在1-100个字符之间' })
  country: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '邮编必须是字符串' })
  @Matches(/^[A-Za-z0-9\s\-]+$/, { message: '邮编格式不正确' })
  postalCode?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '电话号码必须是字符串' })
  @Matches(/^[\d\+\-\s()]+$/, { message: '电话号码格式不正确' })
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '网站地址必须是字符串' })
  @IsUrl({}, { message: '网站地址格式不正确' })
  website?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: '星级必须是整数' })
  @Min(1, { message: '星级最小为1' })
  @Max(5, { message: '星级最大为5' })
  starRating?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: '设施必须是数组' })
  @IsString({ each: true, message: '每个设施项必须是字符串' })
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  // quiz 系统不要求图片上传，暂时移除图片验证
  // @IsArray({ message: '图片列表必须是数组' })
  // @IsUrl({}, { each: true, message: '每个图片URL格式不正确' })
  images?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;
}
