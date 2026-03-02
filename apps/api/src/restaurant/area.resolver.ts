import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { AreaType } from './models/area.type';

@Resolver(() => AreaType)
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Query(() => [AreaType], { description: '查询所有区域' })
  async areas(): Promise<AreaType[]> {
    return await this.areaService.findAll();
  }

  @Query(() => [AreaType], { description: '根据餐厅ID查询区域' })
  async areasByRestaurant(@Args('restaurantId') restaurantId: string): Promise<AreaType[]> {
    return await this.areaService.findByRestaurantId(restaurantId);
  }

  @Query(() => AreaType, { nullable: true, description: '查询单个区域' })
  async area(@Args('id') id: string): Promise<AreaType | null> {
    return await this.areaService.findOne(id);
  }

  @Mutation(() => AreaType, { description: '创建区域' })
  async createArea(
    @Args('restaurantId') restaurantId: string,
    @Args('name') name: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('capacity', { nullable: true }) capacity?: number,
    @Args('minimumCapacity', { nullable: true }) minimumCapacity?: number,
  ): Promise<AreaType> {
    return await this.areaService.create({
      restaurantId,
      name,
      type,
      capacity,
      minimumCapacity,
    });
  }

  @Mutation(() => AreaType, { description: '更新区域' })
  async updateArea(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('capacity', { nullable: true }) capacity?: number,
    @Args('minimumCapacity', { nullable: true }) minimumCapacity?: number,
  ): Promise<AreaType> {
    return await this.areaService.update(id, { name, type, capacity, minimumCapacity });
  }

  @Mutation(() => Boolean, { description: '删除区域' })
  async deleteArea(@Args('id') id: string): Promise<boolean> {
    return await this.areaService.delete(id);
  }
}
