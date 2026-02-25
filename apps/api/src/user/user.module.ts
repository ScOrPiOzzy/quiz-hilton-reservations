import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';
import { UserRepository } from '@/user/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
