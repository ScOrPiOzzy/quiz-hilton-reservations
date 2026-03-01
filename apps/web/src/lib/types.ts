import { JSX } from "solid-js";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export enum HotelStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum RestaurantType {
  HALL = "HALL",
  PRIVATE_ROOM = "PRIVATE_ROOM",
}

export enum AreaType {
  GENERAL = "GENERAL",
  VIP = "VIP",
  OUTDOOR = "OUTDOOR",
}

export enum ReservationStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country?: string;
  phone?: string;
  email?: string;
  status: HotelStatus;
  images: Image[];
  restaurants: Restaurant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelInput {
  name: string;
  city: string;
  country: string;
  address: string;
  description?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  starRating?: number;
  website?: string;
  images?: ImageInput[];
}

export interface UpdateHotelInput {
  id: string;
  name?: string;
  city?: string;
  country?: string;
  address?: string;
  description?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  starRating?: number;
  website?: string;
  images?: ImageInput[];
}

export interface CreateRestaurantInput {
  name: string;
  type: RestaurantType;
  hotelId: string;
  description?: string;
  capacity: number;
  images?: ImageInput[];
}

export interface UpdateRestaurantInput {
  id: string;
  name?: string;
  type?: RestaurantType;
  hotelId?: string;
  description?: string;
  capacity?: number;
  images?: ImageInput[];
}

export interface ImageInput {
  url: string;
  alt?: string;
  order: number;
}

export interface Restaurant {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  name: string;
  type: RestaurantType;
  description?: string;
  capacity: number;
  images: Image[];
  areas: Area[];
  status: HotelStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  restaurantId: string;
  restaurant?: Restaurant;
  name: string;
  type: AreaType;
  capacity: number;
  minimumCapacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface Reservation {
  id: string;
  userId?: string;
  customer: Customer;
  hotelId?: string;
  hotel?: Hotel;
  restaurantId?: string;
  restaurant?: Restaurant;
  areaId?: string;
  area?: Area;
  reservationDate: string;
  timeSlot: string;
  timeSlotName?: string;
  status: ReservationStatus;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  verified: boolean;
  verifiedAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  cancelledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  searchable?: boolean;
  sortable?: boolean;
  render?: (value: any, row: T) => JSX.Element;
}

export interface ActionConfig {
  label: string;
  icon?: JSX.Element;
  type: "primary" | "danger";
  onClick: () => void;
  dropdown?: boolean;
}
