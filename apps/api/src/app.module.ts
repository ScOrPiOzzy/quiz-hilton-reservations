import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResturantModule } from './resturant/resturant.module';

@Module({
  imports: [ResturantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
