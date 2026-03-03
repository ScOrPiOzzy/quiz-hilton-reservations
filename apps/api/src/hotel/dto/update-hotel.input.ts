import { CreateHotelInput } from './create-hotel.input';
import { PartialType, InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateHotelInput extends PartialType(CreateHotelInput) {
  @Field(() => String)
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsString({ message: 'ID必须是字符串' })
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;
}
