import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { ReservationRepository } from './repositories/reservation.repository';

@Module({
  providers: [ReservationResolver, ReservationService, ReservationRepository],
  exports: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
