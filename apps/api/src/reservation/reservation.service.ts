import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './repositories/reservation.repository';
import { ReservationStatus } from './models/reservation.model';
import type { IReservation } from './models/reservation.model';
import type { CreateReservationInput } from './dto/create-reservation.input';
import type { UpdateReservationInput } from './dto/update-reservation.input';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async findAll(query?: any): Promise<IReservation[]> {
    return await this.reservationRepository.findAll(query);
  }

  async findById(id: string): Promise<IReservation | null> {
    return await this.reservationRepository.findById(id);
  }

  async create(input: CreateReservationInput, userId?: string): Promise<IReservation> {
    return await this.reservationRepository.create({
      userId,
      customer: input.customer,
      reservationDate: new Date(input.reservationDate),
      storeId: input.storeId,
      storeName: input.storeName,
      timeSlot: input.timeSlot,
      timeSlotName: input.timeSlotName,
      tableConfigId: input.tableConfigId,
      tableConfigName: input.tableConfigName,
      status: ReservationStatus.REQUESTED,
      specialRequests: input.specialRequests,
      estimatedArrivalTime: input.estimatedArrivalTime,
      verified: false,
    });
  }

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    return await this.reservationRepository.update(id, data);
  }

  async delete(id: string): Promise<{ cas: any }> {
    return await this.reservationRepository.delete(id);
  }

  async updateStatus(id: string, status: ReservationStatus, reason?: string, userId?: string): Promise<IReservation | null> {
    const updateData: Partial<IReservation> = {
      status,
    };

    if (status === ReservationStatus.APPROVED) {
      updateData.confirmedAt = new Date();
      updateData.confirmedBy = userId;
    } else if (status === ReservationStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === ReservationStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
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
