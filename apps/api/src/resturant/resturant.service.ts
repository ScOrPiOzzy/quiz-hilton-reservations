import { Injectable } from '@nestjs/common';
import { CreateResturantInput } from './dto/create-resturant.input';
import { UpdateResturantInput } from './dto/update-resturant.input';

@Injectable()
export class ResturantService {
  create(createResturantInput: CreateResturantInput) {
    return 'This action adds a new resturant';
  }

  findAll() {
    return `This action returns all resturant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resturant`;
  }

  update(id: number, updateResturantInput: UpdateResturantInput) {
    return `This action updates a #${id} resturant`;
  }

  remove(id: number) {
    return `This action removes a #${id} resturant`;
  }
}
