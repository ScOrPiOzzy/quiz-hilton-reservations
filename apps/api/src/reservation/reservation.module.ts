import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { ReservationRepository } from './repositories/reservation.repository';
import { RestaurantModule } from '@/restaurant/restaurant.module';
import { HotelModule } from '@/hotel/hotel.module';

@Module({
  imports: [RestaurantModule, HotelModule],
  providers: [ReservationResolver, ReservationService, ReservationRepository],
  exports: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
