import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResturantModule } from './resturant/resturant.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ResturantModule, HotelModule, ReservationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
