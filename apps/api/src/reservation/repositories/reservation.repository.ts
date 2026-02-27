import { Injectable } from '@nestjs/common';
import { ReservationModel, ReservationStatus } from '../models/reservation.model';
import type { IReservation } from '../models/reservation.model';
import { SearchConsistency } from 'ottoman';

export interface ReservationQuery {
  status?: ReservationStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  phone?: string;
  name?: string;
  storeId?: string;
}

@Injectable()
export class ReservationRepository {
  async findAll(query?: ReservationQuery): Promise<IReservation[]> {
    const filter: any = {};
    if (query?.status) filter.status = query.status;
    if (query?.userId) filter.userId = query.userId;
    if (query?.storeId) filter.storeId = query.storeId;
    if (query?.phone) filter['customer.phone'] = query.phone;
    if (query?.name) filter['customer.name'] = query.name;

    if (query?.dateFrom || query?.dateTo) {
      filter.reservationDate = {};
      if (query.dateFrom) filter.reservationDate.$gte = query.dateFrom;
      if (query.dateTo) filter.reservationDate.$lte = query.dateTo;
    }

    return await ReservationModel.find(filter, { consistency: SearchConsistency.LOCAL });
  }

  async findById(id: string): Promise<IReservation | null> {
    return await ReservationModel.findById(id);
  }

  async create(reservation: Omit<IReservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IReservation> {
    const newReservation = new ReservationModel(reservation);
    const result = await newReservation.save();
    return result as IReservation;
  }

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    return await ReservationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    return await ReservationModel.removeById(id);
  }

  async findByUserId(userId: string): Promise<IReservation[]> {
    return await ReservationModel.find({ userId });
  }

  async findByPhoneAndDate(phone: string, date: Date): Promise<IReservation[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    return await ReservationModel.find({
      'customer.phone': phone,
      reservationDate: { $gte: startOfDay, $lte: endOfDay },
    });
  }

  async findByStatus(status: ReservationStatus): Promise<IReservation[]> {
    return await ReservationModel.find({ status });
  }
}
