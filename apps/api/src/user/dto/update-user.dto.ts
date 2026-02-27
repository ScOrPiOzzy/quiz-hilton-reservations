import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../models/user.model';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
