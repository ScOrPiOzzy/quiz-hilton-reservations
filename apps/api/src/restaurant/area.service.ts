import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { AreaType } from './models/area.type';
import { generateId } from '@/common/utils/id-generator';

@Injectable()
export class AreaService {
  private readonly logger = new Logger(AreaService.name);
  private readonly collectionName = 'Area';

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async create(data: {
    restaurantId: string;
    name: string;
    type?: string;
    capacity?: number;
    minimumCapacity?: number;
  }): Promise<AreaType> {
    const id = generateId('area_');
    const now = new Date().toISOString();
    const area = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await this.couchbaseService.getCollection(this.collectionName).insert(id, area);
    return { id, ...area } as unknown as AreaType;
  }

  async findAll(): Promise<AreaType[]> {
    try {
      const result = await this.couchbaseService.query(
        'SELECT META().id, * FROM `hilton`.`_default`.`Area` ORDER BY createdAt DESC'
      );
      return result.map((row: any) => ({ id: row.id, ...row.Area })) as unknown as AreaType[];
    } catch (error) {
      this.logger.error('findAll error:', error);
      return [];
    }
  }

  async findByRestaurantId(restaurantId: string): Promise<AreaType[]> {
    try {
      const result = await this.couchbaseService.query(
        'SELECT META().id, * FROM `hilton`.`_default`.`Area` WHERE restaurantId = $1 ORDER BY createdAt DESC',
        [restaurantId]
      );
      return result.map((row: any) => ({ id: row.id, ...row.Area })) as unknown as AreaType[];
    } catch (error) {
      this.logger.error('findByRestaurantId error:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<AreaType | null> {
    try {
      const result = await this.couchbaseService.query(
        'SELECT META().id, * FROM `hilton`.`_default`.`Area` USE KEYS $1',
        [id]
      );
      return result.length > 0 ? ({ id: result[0].id, ...result[0].Area } as unknown as AreaType) : null;
    } catch (error) {
      this.logger.error('findOne error:', error);
      return null;
    }
  }

  async update(
    id: string,
    data: {
      name?: string;
      type?: string;
      capacity?: number;
      minimumCapacity?: number;
    }
  ): Promise<AreaType> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('区域不存在');
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await this.couchbaseService.getCollection(this.collectionName).upsert(id, updated);
    return updated as unknown as AreaType;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('区域不存在');
    }

    await this.couchbaseService.getCollection(this.collectionName).remove(id);
    return true;
  }
}
