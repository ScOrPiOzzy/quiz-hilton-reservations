import { CreateRestaurantInput } from './create-restaurant.input';
import { PartialType, InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => String)
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsString({ message: 'ID必须是字符串' })
  id: string;
}
