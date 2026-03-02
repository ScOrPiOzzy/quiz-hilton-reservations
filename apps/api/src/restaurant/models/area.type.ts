import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../common/models/base-entity.type';
import { RestaurantType } from './restaurant.type';

@ObjectType()
export class AreaType extends BaseEntity {
  @Field(() => String, { nullable: true })
  restaurantId?: string;

  @Field(() => RestaurantType, {
    nullable: true,
    description: '所属餐厅',
  })
  restaurant?: RestaurantType;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  capacity?: number;

  @Field(() => Int, { nullable: true })
  minimumCapacity?: number;
}
