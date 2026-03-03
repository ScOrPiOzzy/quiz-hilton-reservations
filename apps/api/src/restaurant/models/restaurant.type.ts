import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ImageType } from '../../common/models/image.type';
import { BaseEntity } from '../../common/models/base-entity.type';
import { HotelType } from '../../hotel/models/hotel.type';
import { AreaType } from './area.type';

@ObjectType()
export class RestaurantType extends BaseEntity {
  @Field(() => String, { nullable: true })
  hotelId?: string;

  @Field(() => HotelType, {
    nullable: true,
    description: '所属酒店',
  })
  hotel?: HotelType;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  capacity?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => [ImageType], { nullable: true })
  images?: ImageType[];

  @Field(() => [AreaType], {
    nullable: true,
    description: '餐厅区域列表',
  })
  areas?: AreaType[];

  @Field(() => String, { nullable: true })
  cuisine?: string;

  @Field(() => String, { nullable: true })
  openingHours?: string;

  @Field(() => [String], { nullable: true })
  timeSlots?: string[];
}
