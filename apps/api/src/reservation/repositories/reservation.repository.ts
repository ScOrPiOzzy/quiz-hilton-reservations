import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { ReservationStatus } from '../models/reservation.model';
import { generateId } from '@/common/utils/id-generator';
import { RestaurantType } from '@/restaurant/models/restaurant.type';
import { HotelType } from '@/hotel/models/hotel.type';

export interface ReservationListQuery {
  status?: ReservationStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  phone?: string;
  name?: string;
  storeId?: string;
  page?: number;
  pageSize?: number;
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
  partySize?: number;
  tableType?: string;
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
  restaurant?: RestaurantType;
  hotel?: HotelType;
}

export interface PaginatedReservationResult {
  items: IReservation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class ReservationRepository {
  private readonly logger = new Logger(ReservationRepository.name);
  private readonly collectionName = 'Reservation';

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async findAll(query?: ReservationListQuery): Promise<IReservation[]> {
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

    sql += ' ORDER BY createdAt DESC';

    try {
      const result = await this.couchbaseService.query(sql, params);
      return result.map((row: any) => ({ id: row.id, ...row.Reservation }));
    } catch (error) {
      this.logger.error('findAll error:', error);
      return [];
    }
  }

  async findAllPaginated(query?: ReservationListQuery): Promise<PaginatedReservationResult> {
    const page = query?.page || 1;
    const pageSize = query?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    let sql = 'SELECT META().id, * FROM `hilton`.`_default`.`Reservation`';
    let countSql = 'SELECT COUNT(1) as total FROM `hilton`.`_default`.`Reservation`';
    const conditions: string[] = [];
    const params: any[] = [];
    const countParams: any[] = [];

    if (query?.status) {
      conditions.push('status = $' + (params.length + 1));
      params.push(query.status);
      countParams.push(query.status);
      countSql += ' WHERE status = $1';
    }
    if (query?.userId) {
      const idx = params.length + 1;
      conditions.push('userId = $' + idx);
      params.push(query.userId);
      const countIdx = countParams.length + 1;
      countParams.push(query.userId);
      countSql += (conditions.length === 1 ? ' WHERE ' : ' AND ') + 'userId = $' + countIdx;
    }
    if (query?.storeId) {
      const idx = params.length + 1;
      conditions.push('storeId = $' + idx);
      params.push(query.storeId);
      const countIdx = countParams.length + 1;
      countParams.push(query.storeId);
      countSql += (conditions.length === 1 ? ' WHERE ' : ' AND ') + 'storeId = $' + countIdx;
    }
    if (query?.phone) {
      const idx = params.length + 1;
      conditions.push('customer.phone = $' + idx);
      params.push(query.phone);
      const countIdx = countParams.length + 1;
      countParams.push(query.phone);
      countSql += (conditions.length === 1 ? ' WHERE ' : ' AND ') + 'customer.phone = $' + countIdx;
    }
    if (query?.name) {
      const idx = params.length + 1;
      conditions.push('LOWER(customer.name) LIKE $' + idx);
      params.push(`%${query.name.toLowerCase()}%`);
      const countIdx = countParams.length + 1;
      countParams.push(`%${query.name.toLowerCase()}%`);
      countSql += (conditions.length === 1 ? ' WHERE ' : ' AND ') + 'LOWER(customer.name) LIKE $' + countIdx;
    }

    if (query?.dateFrom || query?.dateTo) {
      const dateFromIdx = params.length + 1;
      conditions.push('reservationDate >= $' + dateFromIdx);
      params.push(query.dateFrom?.toISOString() || '1970-01-01');
      const countDateFromIdx = countParams.length + 1;
      countParams.push(query.dateFrom?.toISOString() || '1970-01-01');
      countSql += (conditions.length === 1 ? ' WHERE ' : ' AND ') + 'reservationDate >= $' + countDateFromIdx;

      const dateToIdx = params.length + 1;
      conditions.push('reservationDate <= $' + dateToIdx);
      params.push(query.dateTo?.toISOString() || '2100-12-31');
      const countDateToIdx = countParams.length + 1;
      countParams.push(query.dateTo?.toISOString() || '2100-12-31');
      countSql += ' AND reservationDate <= $' + countDateToIdx;
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY createdAt DESC LIMIT $' +
      (params.length + 1) +
      ' OFFSET $' +
      (params.length + 2);
    params.push(pageSize, skip);

    try {
      const [result, countResult] = await Promise.all([this.couchbaseService.query(sql, params), this.couchbaseService.query(countSql, countParams)]);

      const items = result.map((row: any) => ({ id: row.id, ...row.Reservation }));
      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      this.logger.error('findAllPaginated error:', error);
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }

  async findById(id: string): Promise<IReservation | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` USE KEYS $1', [id]);
      return result.length > 0 ? { id: result[0].id, ...result[0].Reservation } : null;
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

  async delete(id: string): Promise<boolean> {
    await this.couchbaseService.getCollection(this.collectionName).remove(id);
    return true;
  }

  async findByUserId(userId: string): Promise<IReservation[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` WHERE userId = $1', [userId]);
      return result.map((row: any) => ({ id: row.id, ...row.Reservation }));
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
      return result.map((row: any) => ({ id: row.id, ...row.Reservation }));
    } catch (error) {
      this.logger.error('findByPhoneAndDate error:', error);
      return [];
    }
  }

  async findByStatus(status: ReservationStatus): Promise<IReservation[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Reservation` WHERE status = $1', [status]);
      return result.map((row: any) => ({ id: row.id, ...row.Reservation }));
    } catch (error) {
      this.logger.error('findByStatus error:', error);
      return [];
    }
  }
}
