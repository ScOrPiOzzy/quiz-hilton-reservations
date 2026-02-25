import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResturantModule } from './resturant/resturant.module';
import { HotelModule } from './hotel/hotel.module';

@Module({
  imports: [ResturantModule, HotelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
