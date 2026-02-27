import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '@repo/schemas';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
