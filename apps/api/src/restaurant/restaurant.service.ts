import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { RestaurantType } from './models/restaurant.type';
import { RestaurantListInput } from './dto/restaurant-list.input';
import { PaginatedRestaurant } from './dto/paginated-restaurant';
import { generateId } from '@/common/utils/id-generator';
import { restaurantImages } from '@/common/constants';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);
  private readonly collectionName = 'Restaurant';

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async create(createRestaurantInput: CreateRestaurantInput): Promise<RestaurantType> {
    const id = generateId('rest_');
    const now = new Date().toISOString();
    const restaurant = {
      ...createRestaurantInput,
      createdAt: now,
      updatedAt: now,
    };

    await this.couchbaseService.getCollection(this.collectionName).insert(id, restaurant);
    return { id, ...restaurant } as unknown as RestaurantType;
  }

  async findAll(input: RestaurantListInput): Promise<PaginatedRestaurant> {
    const { page = 1, pageSize = 20, hotelId, search } = input;
    const skip = (page - 1) * pageSize;

    let query = `
      SELECT r.*,
             h.id as hotelId,
             h.name as hotelName,
             h.city as hotelCity
      FROM \`hilton\`.\`_default\`.\`Restaurant\` r
      LEFT JOIN \`hilton\`.\`_default\`.\`Hotel\` h ON r.hotelId = h.id
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (hotelId) {
      conditions.push('h.id = $' + (params.length + 1));
      params.push(hotelId);
    }
    if (search) {
      conditions.push('LOWER(r.name) LIKE $' + (params.length + 1));
      params.push(`%${search.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY r.updatedAt DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(pageSize, skip);

    try {
      const result = await this.couchbaseService.query(query, params);

      type Row = RestaurantType & {
        hotelId: string;
        hotelName: string;
        hotelCity: string;
      };
      // 组合餐厅和酒店数据
      const items = result.map((row: Row) => {
        console.log(`🚀 ~ RestaurantService ~ findAll ~ row:`, row);
        const hotelId = row.hotelId;
        // 只有当有 hotelId 时才返回 hotel 对象
        const hotel = hotelId ? { id: row.hotelId, name: row.hotelName, city: row.hotelCity } : null;
        return { ...row, hotel, images: restaurantImages };
      });

      return {
        items: items as unknown as RestaurantType[],
        total: items.length,
        page,
        pageSize,
        totalPages: Math.ceil(items.length / pageSize),
      };
    } catch (error) {
      this.logger.error('findAll error:', error);
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }

  async findAllSimple(): Promise<RestaurantType[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Restaurant` LIMIT 100');
      return result.map((row: any) => ({ id: row.id, ...row.Restaurant })) as unknown as RestaurantType[];
    } catch (error) {
      this.logger.error('findAllSimple error:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<RestaurantType | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Restaurant` USE KEYS $1', [id]);
      return result.length > 0 ? ({ id: result[0].id, ...result[0].Restaurant } as unknown as RestaurantType) : null;
    } catch (error) {
      this.logger.error('findOne error:', error);
      return null;
    }
  }

  async update(id: string, updateRestaurantInput: UpdateRestaurantInput): Promise<RestaurantType> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('餐厅不存在');
    }

    const updated = {
      ...existing,
      ...updateRestaurantInput,
      updatedAt: new Date().toISOString(),
    };

    await this.couchbaseService.getCollection(this.collectionName).upsert(id, updated);
    return updated as unknown as RestaurantType;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('餐厅不存在');
    }

    await this.couchbaseService.getCollection(this.collectionName).remove(id);
    return true;
  }

  async findByHotelId(hotelId: string): Promise<RestaurantType[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`Restaurant` WHERE hotelId = $1', [hotelId]);
      return result.map((row: any) => ({ id: row.id, ...row.Restaurant })) as unknown as RestaurantType[];
    } catch (error) {
      this.logger.error('findByHotelId error:', error);
      return [];
    }
  }
}
