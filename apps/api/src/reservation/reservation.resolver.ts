import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { ReservationStatus, ReservationType } from './models/reservation.model';
import type { CreateReservationInput } from './dto/create-reservation.input';
import type { UpdateReservationInput } from './dto/update-reservation.input';
import type { UpdateReservationStatusInput } from './dto/update-status.input';
import type { IReservation } from './models/reservation.model';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [ReservationType])
  async reservations(
    @Args('status') status?: ReservationStatus,
    @Args('userId') userId?: string,
    @Args('dateFrom') dateFrom?: string,
    @Args('dateTo') dateTo?: string,
    @Args('phone') phone?: string,
    @Args('name') name?: string,
    @Args('storeId') storeId?: string,
  ): Promise<IReservation[]> {
    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (storeId) query.storeId = storeId;
    if (phone) query.phone = phone;
    if (name) query.name = name;
    if (dateFrom) query.dateFrom = new Date(dateFrom);
    if (dateTo) query.dateTo = new Date(dateTo);

    return await this.reservationService.findAll(query);
  }

  @Query(() => ReservationType)
  async reservation(@Args('id') id: string): Promise<IReservation | null> {
    return await this.reservationService.findById(id);
  }

  @Mutation(() => ReservationType)
  async createReservation(@Args('input') input: CreateReservationInput, @Context() context: any): Promise<IReservation> {
    const userId = context.req?.user?.id;
    return await this.reservationService.create(input, userId);
  }

  @Mutation(() => ReservationType)
  async updateReservation(@Args('input') input: UpdateReservationInput): Promise<IReservation | null> {
    const data: any = {};
    if (input.userId) data.userId = input.userId;
    if (input.customer) data.customer = input.customer;
    if (input.reservationDate) data.reservationDate = new Date(input.reservationDate);
    if (input.storeId) data.storeId = input.storeId;
    if (input.storeName) data.storeName = input.storeName;
    if (input.timeSlot) data.timeSlot = input.timeSlot;
    if (input.timeSlotName) data.timeSlotName = input.timeSlotName;
    if (input.tableConfigId) data.tableConfigId = input.tableConfigId;
    if (input.tableConfigName) data.tableConfigName = input.tableConfigName;
    if (input.specialRequests !== undefined) data.specialRequests = input.specialRequests;
    if (input.estimatedArrivalTime !== undefined) data.estimatedArrivalTime = input.estimatedArrivalTime;

    return await this.reservationService.update(input.reservationId, data);
  }

  @Mutation(() => ReservationType)
  async updateReservationStatus(@Args('input') input: UpdateReservationStatusInput, @Context() context: any): Promise<IReservation | null> {
    const userId = context.req?.user?.id;
    return await this.reservationService.updateStatus(input.reservationId, input.status, input.reason, userId);
  }

  @Mutation(() => Boolean)
  async deleteReservation(@Args('id') id: string): Promise<{ cas: any }> {
    return await this.reservationService.delete(id);
  }
}
