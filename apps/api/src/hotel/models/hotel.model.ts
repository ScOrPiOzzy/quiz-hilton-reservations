import { Schema } from 'ottoman';
import { ottomanInstance } from '@/couchbase/ottoman-instance';

export interface IHotel {
  id?: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  starRating?: number;
  amenities?: string[];
  images?: string[];
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: String,
    phone: String,
    email: String,
    website: String,
    starRating: Number,
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

hotelSchema.index.findByCity = {
  by: ['city'],
  type: 'n1ql',
};

hotelSchema.index.findActive = {
  by: ['active'],
  type: 'n1ql',
};

export const HotelModel = ottomanInstance.model('Hotel', hotelSchema, {
  collectionName: 'Hotel',
});
