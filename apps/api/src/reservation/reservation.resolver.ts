import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { ReservationStatus, ReservationType } from './models/reservation.model';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { UpdateReservationStatusInput } from './dto/update-status.input';
import { IReservation } from './models/reservation.model';
import { GetReservationsArgs } from './dto/get-reservations.args';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [ReservationType], { description: '查询预订列表' })
  async reservations(@Args() args: GetReservationsArgs): Promise<IReservation[]> {
    const { status, userId, storeId, phone, name, dateFrom, dateTo } = args;

    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (storeId) query.storeId = storeId;
    if (phone) query.phone = phone;
    if (name) query.name = name;
    if (dateFrom) query.dateFrom = dateFrom;
    if (dateTo) query.dateTo = dateTo;

    return await this.reservationService.findAll(query);
  }

  @Query(() => ReservationType, { nullable: true, description: '查询单个预订' })
  async reservation(@Args('id') id: string): Promise<IReservation | null> {
    return await this.reservationService.findById(id);
  }
}
