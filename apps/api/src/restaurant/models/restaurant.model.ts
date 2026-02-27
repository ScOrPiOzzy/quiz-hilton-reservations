import { Schema } from 'ottoman';
import { ottomanInstance } from '@/couchbase/ottoman-instance';

export interface IRestaurant {
  id?: string;
  name: string;
  description?: string;
  cuisine?: string;
  capacity?: number;
  openingHours?: string;
  hotelId?: string;
  hotelName?: string;
  location?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    cuisine: String,
    capacity: Number,
    openingHours: String,
    hotelId: String,
    hotelName: String,
    location: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

restaurantSchema.index.findByHotel = {
  by: ['hotelId'],
  type: 'n1ql',
};

restaurantSchema.index.findActive = {
  by: ['active'],
  type: 'n1ql',
};

export const RestaurantModel = ottomanInstance.model('Restaurant', restaurantSchema, {
  collectionName: 'Restaurant',
});
