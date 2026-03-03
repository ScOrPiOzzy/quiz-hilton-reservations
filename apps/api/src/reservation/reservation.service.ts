import { Injectable } from '@nestjs/common';
import { ReservationRepository, PaginatedReservationResult } from './repositories/reservation.repository';
import { ReservationStatus } from './models/reservation.model';
import type { IReservation } from './models/reservation.model';
import type { CreateReservationInput } from './dto/create-reservation.input';
import type { ReservationListInput } from './dto/reservation-list.input';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async findAll(query?: any): Promise<IReservation[]> {
    return await this.reservationRepository.findAll(query);
  }

  async findAllPaginated(input: ReservationListInput): Promise<PaginatedReservationResult> {
    return await this.reservationRepository.findAllPaginated(input);
  }

  async findById(id: string): Promise<IReservation | null> {
    return await this.reservationRepository.findById(id);
  }

  async create(input: CreateReservationInput, userId?: string): Promise<IReservation> {
    return await this.reservationRepository.create({
      userId: input.userId || userId,
      customer: input.customer,
      reservationDate: input.reservationDate,
      storeId: input.storeId,
      storeName: input.storeName,
      timeSlot: input.timeSlot,
      timeSlotName: input.timeSlotName,
      tableConfigId: input.tableConfigId,
      tableConfigName: input.tableConfigName,
      partySize: input.partySize,
      tableType: input.tableType,
      hotelId: input.hotelId,
      restaurantId: input.restaurantId,
      areaId: input.areaId,
      status: ReservationStatus.REQUESTED,
      specialRequests: input.specialRequests,
      estimatedArrivalTime: input.estimatedArrivalTime,
    });
  }

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    return await this.reservationRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.reservationRepository.delete(id);
  }

  async updateStatus(id: string, status: ReservationStatus, reason?: string, userId?: string): Promise<IReservation | null> {
    const updateData: Partial<IReservation> = {
      status,
    };

    if (status === ReservationStatus.APPROVED) {
      updateData.confirmedAt = new Date().toISOString();
      updateData.confirmedBy = userId;
    } else if (status === ReservationStatus.COMPLETED) {
      updateData.completedAt = new Date().toISOString();
    } else if (status === ReservationStatus.CANCELLED) {
      updateData.cancelledAt = new Date().toISOString();
      updateData.cancelReason = reason;
      updateData.cancelledBy = userId;
    }

    return await this.reservationRepository.update(id, updateData);
  }

  async findByUserId(userId: string): Promise<IReservation[]> {
    return await this.reservationRepository.findByUserId(userId);
  }

  async findByStatus(status: ReservationStatus): Promise<IReservation[]> {
    return await this.reservationRepository.findByStatus(status);
  }
}
