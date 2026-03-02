import { ObjectType, Field, Int, ArgsType } from '@nestjs/graphql';
import { IsInt, Min, Max } from 'class-validator';

/**
 * DateTime scalar type for GraphQL
 */
export const DateTimeScalarType = 'DateTime';

/**
 * 基础实体类型
 * 所有实体类型都应继承此基类，包含通用的 ID 和时间戳字段
 */
@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @Field(() => String, { nullable: true, description: '实体ID' })
  id?: string;

  @Field(() => String, { nullable: true, description: '创建时间' })
  createdAt?: Date;

  @Field(() => String, { nullable: true, description: '更新时间' })
  updatedAt?: Date;
}

/**
 * 分页参数基类
 * 所有分页查询的输入都应继承此基类
 */
@ArgsType()
export abstract class PaginationInput {
  @Field(() => Int, { defaultValue: 1, description: '页码，从1开始' })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page: number = 1;

  @Field(() => Int, { defaultValue: 20, description: '每页数量' })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  @Max(100, { message: '每页数量不能超过100' })
  pageSize: number = 20;
}
