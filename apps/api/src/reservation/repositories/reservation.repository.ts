import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { ReservationStatus } from '../models/reservation.model';
import { generateId } from '@/common/utils/id-generator';

export interface ReservationQuery {
  status?: ReservationStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  phone?: string;
  name?: string;
  storeId?: string;
}

export interface IReservation {
  id: string;
  userId?: string;
  storeId?: string;
  storeName?: string;
  reservationDate: string;
  status: ReservationStatus;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  timeSlot?: string;
  timeSlotName?: string;
  tableConfigId?: string;
  tableConfigName?: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  hotelId?: string;
  restaurantId?: string;
  areaId?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  cancelledBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable()
export class ReservationRepository {
  private readonly logger = new Logger(ReservationRepository.name);
  private readonly collectionName = 'Reservation';

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async findAll(query?: ReservationQuery): Promise<IReservation[]> {
    let sql = 'SELECT META().id, * FROM `hilton`.`_default`.`Reservation`';
    const conditions: string[] = [];
    const params: any[] = [];

    if (query?.status) {
      conditions.push('status = $' + (params.length + 1));
      params.push(query.status);
    }
    if (query?.userId) {
      conditions.push('userId = $' + (params.length + 1));
      params.push(query.userId);
    }
    if (query?.storeId) {
      conditions.push('storeId = $' + (params.length + 1));
      params.push(query.storeId);
    }
    if (query?.phone) {
      conditions.push('customer.phone = $' + (params.length + 1));
      params.push(query.phone);
    }
    if (query?.name) {
      conditions.push('LOWER(customer.name) LIKE $' + (params.length + 1));
      params.push(`%${query.name.toLowerCase()}%`);
    }

    if (query?.dateFrom || query?.dateTo) {
      conditions.push('reservationDate >= $' + (params.length + 1));
      params.push(query.dateFrom?.toISOString() || '1970-01-01');
      conditions.push('reservationDate <= $' + (params.length + 1));
      params.push(query.dateTo?.toISOString() || '2100-12-31');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' LIMIT 100';

    try {
      const result = await this.couchbaseService.query(sql, params);
      return result.map((row: any) => row.Reservation);
    } catch (error) {
      this.logger.error('findAll error:', error);
      return [];
    }
  }

  async findById(id: string): Promise<IReservation | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` USE KEYS $1', [id]);
      return result.length > 0 ? result[0].Reservation : null;
    } catch (error) {
      this.logger.error('findById error:', error);
      return null;
    }
  }

  async create(reservation: Omit<IReservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IReservation> {
    const id = generateId('res_');
    const now = new Date().toISOString();
    const data = {
      ...reservation,
      createdAt: now,
      updatedAt: now,
    };

    await this.couchbaseService.getCollection(this.collectionName).insert(id, data);
    return { id, ...data };
  }

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await this.couchbaseService.getCollection(this.collectionName).upsert(id, updated);
    return updated;
  }

  async delete(id: string): Promise<{ cas: any }> {
    await this.couchbaseService.getCollection(this.collectionName).remove(id);
    return { cas: 0 };
  }

  async findByUserId(userId: string): Promise<IReservation[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` WHERE userId = $1', [userId]);
      return result.map((row: any) => row.Reservation);
    } catch (error) {
      this.logger.error('findByUserId error:', error);
      return [];
    }
  }

  async findByPhoneAndDate(phone: string, date: Date): Promise<IReservation[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` WHERE customer.phone = $1 AND reservationDate >= $2 AND reservationDate <= $3', [
        phone,
        startOfDay.toISOString(),
        endOfDay.toISOString(),
      ]);
      return result.map((row: any) => row.Reservation);
    } catch (error) {
      this.logger.error('findByPhoneAndDate error:', error);
      return [];
    }
  }

  async findByStatus(status: ReservationStatus): Promise<IReservation[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` WHERE status = $1', [status]);
      return result.map((row: any) => row.Reservation);
    } catch (error) {
      this.logger.error('findByStatus error:', error);
      return [];
    }
  }
}
