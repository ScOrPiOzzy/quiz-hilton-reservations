import { CreateRestaurantInput } from './create-restaurant.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
  id: number;
}
