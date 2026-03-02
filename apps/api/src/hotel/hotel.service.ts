import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { HotelListInput } from './dto/hotel-list.input';
import { PaginatedHotel } from './dto/paginated-hotel';
import { HotelType } from './models/hotel.type';
import { CreateHotelInput } from './dto/create-hotel.input';
import { UpdateHotelInput } from './dto/update-hotel.input';
import { generateId } from '@/common/utils/id-generator';
import { hotelImages } from '@/common/constants';

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);
  private readonly collectionName = 'Hotel';

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async findAll(input: HotelListInput): Promise<PaginatedHotel> {
    const { page = 1, pageSize = 20, city, search } = input;
    const skip = (page - 1) * pageSize;

    let query = 'SELECT META().id, * FROM `hilton`.`_default`.`Hotel`';
    const conditions: string[] = [];
    const params: any[] = [];

    if (city) {
      conditions.push('city = $' + (params.length + 1));
      params.push(city);
    }
    if (search) {
      conditions.push('LOWER(name) LIKE $' + (params.length + 1));
      params.push(`%${search.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(pageSize, skip);

    try {
      const result = await this.couchbaseService.query(query, params);
      const items = result.map<HotelType>((row: any) => {
        const hotel = row.Hotel || row;
        // 移除 Couchbase 自动添加的元数据（_type, active 等）
        const { _type, active, ...cleanHotel } = hotel || {};
        return {
          id: row.id || row.meta?.id || cleanHotel.id,
          ...cleanHotel,
          images: hotelImages,
          restaurants: cleanHotel.restaurants || [],
        };
      });

      const countQuery = 'SELECT COUNT(*) as total FROM `hilton`.`_default`.`Hotel`' + (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '');
      const countResult = await this.couchbaseService.query(countQuery, params.slice(0, -2));
      const total = countResult[0]?.total || 0;

      return { items: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    } catch (error) {
      this.logger.error('findAll error:', error);
      return { items: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  async findOne(id: string): Promise<HotelType | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Hotel` USE KEYS $1', [id]);
      console.log(`🏨 ~ HotelService ~ findOne ~ result[0]:`, result[0]);
      if (result.length > 0) {
        const hotel = result[0].Hotel as unknown as HotelType;
        // 移除 Couchbase 自动添加的元数据（_type, active 等）
        console.log(`🏨 ~ HotelService ~ findOne ~ hotel.id:`, hotel.id);
        console.log(`🏨 ~ HotelService ~ findOne ~ hotelId (from meta):`, result[0].id);
        // 确保数组字段不为 null
        return { ...hotel, id: result[0].id, images: hotelImages, restaurants: hotel.restaurants || [] };
      }
      return null;
    } catch (error) {
      this.logger.error('findOne error:', error);
      return null;
    }
  }

  async create(createHotelInput: CreateHotelInput): Promise<HotelType> {
    const id = generateId('hotel_');
    const now = new Date().toISOString();
    const hotel = {
      ...createHotelInput,
      createdAt: now,
      updatedAt: now,
    };

    await this.couchbaseService.getCollection(this.collectionName).insert(id, hotel);
    return { id, ...hotel } as unknown as HotelType;
  }

  async update(id: string, updateHotelInput: UpdateHotelInput): Promise<HotelType> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('酒店不存在');
    }

    const updated = {
      ...existing,
      ...updateHotelInput,
      updatedAt: new Date().toISOString(),
    };

    await this.couchbaseService.getCollection(this.collectionName).upsert(id, updated);
    return updated as unknown as HotelType;
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('酒店不存在');
    }

    await this.couchbaseService.getCollection(this.collectionName).remove(id);
    return true;
  }
}
