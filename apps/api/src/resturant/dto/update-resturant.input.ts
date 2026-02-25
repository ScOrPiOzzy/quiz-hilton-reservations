import { CreateResturantInput } from './create-resturant.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateResturantInput extends PartialType(CreateResturantInput) {
  id: number;
}
