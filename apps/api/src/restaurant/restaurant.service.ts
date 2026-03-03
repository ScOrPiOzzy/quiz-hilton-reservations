import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { RestaurantType } from './models/restaurant.type';
import { RestaurantListInput } from './dto/restaurant-list.input';
import { PaginatedRestaurant } from './dto/paginated-restaurant';
import { generateId } from '@/common/utils/id-generator';
import { getRestaurantImages } from '@/common/constants';

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
      images: getRestaurantImages(),
      createdAt: now,
      updatedAt: now,
    };

    await this.couchbaseService.getCollection(this.collectionName).insert(id, restaurant);
    return { id, ...restaurant } as unknown as RestaurantType;
  }

  async findAll(input: RestaurantListInput): Promise<PaginatedRestaurant> {
    const { page = 1, pageSize = 20, hotelId, search } = input;
    const skip = (page - 1) * pageSize;

    // 先查询餐厅数据
    let query = `
      SELECT META().id as id, r.*
      FROM \`hilton\`.\`_default\`.\`Restaurant\` r
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (hotelId) {
      conditions.push('r.hotelId = $' + (params.length + 1));
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

      // 获取所有唯一的 hotelId
      const hotelIds = [...new Set(result.map((r: any) => r.hotelId).filter(Boolean))];

      // 批量查询酒店信息
      let hotels: Record<string, { id: string; name: string; city: string }> = {};
      if (hotelIds.length > 0) {
        const hotelQuery = `
          SELECT META().id as id, \`Hotel\`.name, \`Hotel\`.city
          FROM \`hilton\`.\`_default\`.\`Hotel\`
          WHERE META().id IN [${hotelIds.map((_, i) => '$' + (i + 1)).join(', ')}]
        `;
        console.log(`🚀 ~ RestaurantService ~ hotelQuery:`, hotelQuery);
        console.log(`🚀 ~ RestaurantService ~ hotelIds:`, hotelIds);
        const hotelResult = await this.couchbaseService.query(hotelQuery, hotelIds);
        console.log(`🚀 ~ RestaurantService ~ hotelResult:`, hotelResult);
        hotels = hotelResult.reduce((acc: any, h: any) => {
          console.log(`🚀 ~ RestaurantService ~ hotel:`, h);
          acc[h.id] = { id: h.id, name: h.name, city: h.city };
          return acc;
        }, {});
      }

      // 组合餐厅和酒店数据
      const items = result.map((row: any) => {
        console.log(`🚀 ~ RestaurantService ~ findAll ~ row:`, row);
        console.log(`🚀 ~ RestaurantService ~ findAll ~ row.hotelId:`, row.hotelId);
        console.log(`🚀 ~ RestaurantService ~ findAll ~ hotels:`, hotels);
        const hotel = row.hotelId && hotels[row.hotelId] ? hotels[row.hotelId] : null;
        const restaurant = { ...row, hotel };
        if (!restaurant.timeSlots || restaurant.timeSlots.length === 0) {
          restaurant.timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
        }
        return restaurant;
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
      const allRestaurants = await this.findAllSimple();
      const restaurant = allRestaurants.find((r) => r.id === id);
      if (!restaurant) return null;
      return {
        ...restaurant,
        timeSlots: restaurant.timeSlots?.length ? restaurant.timeSlots : ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
      };
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

    const { id: _inputId, ...updateData } = updateRestaurantInput;
    const updated = {
      ...existing,
      ...updateData,
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
