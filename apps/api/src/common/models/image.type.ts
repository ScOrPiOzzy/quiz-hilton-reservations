import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ImageType {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  alt?: string;

  @Field(() => Int)
  order!: number;
}
