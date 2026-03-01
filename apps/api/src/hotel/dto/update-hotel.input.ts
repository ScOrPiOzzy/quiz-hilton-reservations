import { CreateHotelInput } from './create-hotel.input';
import { PartialType, InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateHotelInput extends PartialType(CreateHotelInput) {
  @Field(() => String)
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsString({ message: 'ID必须是字符串' })
  id: string;
}
