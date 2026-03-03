import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { ReservationType } from './models/reservation.model';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationStatusInput } from './dto/update-status.input';
import { IReservation } from './models/reservation.model';
import { ReservationListInput } from './dto/reservation-list.input';
import { PaginatedReservation } from './dto/paginated-reservation';
import { RestaurantService } from '@/restaurant/restaurant.service';
import { HotelService } from '@/hotel/hotel.service';
import { GetReservationsArgs } from './dto/get-reservations.args';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly restaurantService: RestaurantService,
    private readonly hotelService: HotelService,
  ) {}

  @Query(() => [ReservationType], { description: '查询当前用户的预订列表' })
  async myReservations(@Args() args: GetReservationsArgs): Promise<IReservation[]> {
    const { userId, status } = args;

    const query: any = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const reservations = await this.reservationService.findAll(query);

    for (const reservation of reservations) {
      if (reservation.restaurantId) {
        reservation.restaurant = (await this.restaurantService.findOne(reservation.restaurantId)) || undefined;
      }
      if (reservation.hotelId) {
        reservation.hotel = (await this.hotelService.findOne(reservation.hotelId)) || undefined;
      }
    }

    return reservations;
  }

  @Query(() => PaginatedReservation, { description: '查询预订列表（分页）' })
  async reservations(@Args('input') input: ReservationListInput): Promise<PaginatedReservation> {
    const { page, pageSize, status, userId, storeId, phone, name, dateFrom, dateTo } = input;

    const query: any = {
      page,
      pageSize,
    };
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (storeId) query.storeId = storeId;
    if (phone) query.phone = phone;
    if (name) query.name = name;
    if (dateFrom) query.dateFrom = dateFrom;
    if (dateTo) query.dateTo = dateTo;

    const result = await this.reservationService.findAllPaginated(query);

    for (const reservation of result.items) {
      if (reservation.restaurantId) {
        reservation.restaurant = (await this.restaurantService.findOne(reservation.restaurantId)) || undefined;
      }
      if (reservation.hotelId) {
        reservation.hotel = (await this.hotelService.findOne(reservation.hotelId)) || undefined;
      }
    }

    return result;
  }

  @Query(() => ReservationType, { nullable: true, description: '查询单个预订' })
  async reservation(@Args('id') id: string): Promise<IReservation | null> {
    return await this.reservationService.findById(id);
  }

  @Mutation(() => ReservationType, { description: '创建预订' })
  async createReservation(@Args('input') input: CreateReservationInput): Promise<IReservation> {
    return await this.reservationService.create(input);
  }

  @Mutation(() => Boolean, { description: '取消预订' })
  async cancelReservation(@Args('id') id: string): Promise<boolean> {
    return await this.reservationService.delete(id);
  }
  @Mutation(() => ReservationType, { description: '更新预订状态' })
  async updateStatus(@Args('input') input: UpdateReservationStatusInput): Promise<IReservation | null> {
    return await this.reservationService.updateStatus(input.id, input.status);
  }
}
