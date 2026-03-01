import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { HotelService } from './hotel.service';
import { HotelType } from './models/hotel.type';
import { HotelListInput } from './dto/hotel-list.input';
import { PaginatedHotel } from './dto/paginated-hotel';
import { CreateHotelInput } from './dto/create-hotel.input';
import { UpdateHotelInput } from './dto/update-hotel.input';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RestaurantType } from '../restaurant/models/restaurant.type';

@Resolver(() => HotelType)
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @Query(() => PaginatedHotel, { description: '查询酒店列表' })
  async hotels(@Args('input') input: HotelListInput): Promise<PaginatedHotel> {
    return await this.hotelService.findAll(input);
  }

  @Query(() => HotelType, { description: '查询单个酒店' })
  async hotel(@Args('id') id: string): Promise<HotelType | null> {
    return await this.hotelService.findOne(id);
  }

  @Mutation(() => HotelType, { description: '创建酒店' })
  async createHotel(@Args('input') input: CreateHotelInput): Promise<HotelType> {
    return await this.hotelService.create(input);
  }

  @Mutation(() => HotelType, { description: '更新酒店' })
  async updateHotel(@Args('id') id: string, @Args('input') input: UpdateHotelInput): Promise<HotelType> {
    return await this.hotelService.update(id, input);
  }

  @Mutation(() => Boolean, { description: '删除酒店' })
  async deleteHotel(@Args('id') id: string): Promise<boolean> {
    return await this.hotelService.remove(id);
  }

  /**
   * 解析酒店关联的餐厅列表
   * 使用 @ResolveField 避免 N+1 查询问题
   * 当查询酒店列表并需要每个酒店的餐厅时，会批量查询而非逐个查询
   */
  @ResolveField(() => [RestaurantType], {
    description: '酒店关联的餐厅列表',
    nullable: true,
  })
  async restaurants(@Parent() hotel: HotelType): Promise<RestaurantType[]> {
    if (!hotel.id) {
      return [];
    }
    return await this.restaurantService.findByHotelId(hotel.id);
  }
}
