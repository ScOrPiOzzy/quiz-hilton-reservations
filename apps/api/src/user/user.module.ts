import { Module } from '@nestjs/common';
import { CouchBaseModule } from 'nestjs-couchbase';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';
import { UserRepository } from '@/user/repositories/user.repository';
import { User } from '@/user/entities/user.entity';

@Module({
  imports: [CouchBaseModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
