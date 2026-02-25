import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ResturantService } from './resturant.service';
import { CreateResturantInput } from './dto/create-resturant.input';
import { UpdateResturantInput } from './dto/update-resturant.input';

@Resolver('Resturant')
export class ResturantResolver {
  constructor(private readonly resturantService: ResturantService) {}

  @Mutation('createResturant')
  create(@Args('createResturantInput') createResturantInput: CreateResturantInput) {
    return this.resturantService.create(createResturantInput);
  }

  @Query('resturant')
  findAll() {
    return this.resturantService.findAll();
  }

  @Query('resturant')
  findOne(@Args('id') id: number) {
    return this.resturantService.findOne(id);
  }

  @Mutation('updateResturant')
  update(@Args('updateResturantInput') updateResturantInput: UpdateResturantInput) {
    return this.resturantService.update(updateResturantInput.id, updateResturantInput);
  }

  @Mutation('removeResturant')
  remove(@Args('id') id: number) {
    return this.resturantService.remove(id);
  }
}
