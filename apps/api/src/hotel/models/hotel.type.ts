import { ObjectType, Field } from '@nestjs/graphql';
import { ImageType } from '../../common/models/image.type';
import { BaseEntity } from '../../common/models/base-entity.type';
import { RestaurantType } from '../../restaurant/models/restaurant.type';

@ObjectType()
export class HotelType extends BaseEntity {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  address!: string;

  @Field(() => String)
  city!: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => [ImageType], { nullable: true })
  images?: ImageType[];

  @Field(() => [RestaurantType], {
    nullable: true,
    description: '酒店关联的餐厅列表',
  })
  restaurants?: RestaurantType[];
}
