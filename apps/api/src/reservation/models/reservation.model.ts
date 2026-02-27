import { Schema } from 'ottoman';
import { ottomanInstance } from '@/couchbase/ottoman-instance';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum ReservationStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(ReservationStatus, { name: 'ReservationStatus' });

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface IReservation {
  id?: string;
  userId?: string;
  customer: Customer;
  reservationDate: Date;
  storeId?: string;
  storeName?: string;
  timeSlot: string;
  timeSlotName?: string;
  tableConfigId?: string;
  tableConfigName?: string;
  status: ReservationStatus;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  verified?: boolean;
  verifiedAt?: Date;
  confirmedAt?: Date;
  confirmedBy?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  cancelledBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@ObjectType('Customer')
export class CustomerType {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@ObjectType('Reservation')
export class ReservationType {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => CustomerType)
  customer: CustomerType;

  @Field(() => Date)
  reservationDate: Date;

  @Field(() => String, { nullable: true })
  storeId?: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

  @Field(() => String)
  timeSlot: string;

  @Field(() => String, { nullable: true })
  timeSlotName?: string;

  @Field(() => String, { nullable: true })
  tableConfigId?: string;

  @Field(() => String, { nullable: true })
  tableConfigName?: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field(() => String, { nullable: true })
  specialRequests?: string;

  @Field(() => String, { nullable: true })
  estimatedArrivalTime?: string;

  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => Date, { nullable: true })
  verifiedAt?: Date;

  @Field(() => Date, { nullable: true })
  confirmedAt?: Date;

  @Field(() => String, { nullable: true })
  confirmedBy?: string;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  cancelledAt?: Date;

  @Field(() => String, { nullable: true })
  cancelReason?: string;

  @Field(() => String, { nullable: true })
  cancelledBy?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

const reservationSchema = new Schema(
  {
    userId: String,
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    reservationDate: {
      type: Date,
      required: true,
    },
    storeId: String,
    storeName: String,
    timeSlot: {
      type: String,
      required: true,
    },
    timeSlotName: String,
    tableConfigId: String,
    tableConfigName: String,
    status: {
      type: String,
      required: true,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.REQUESTED,
    },
    specialRequests: String,
    estimatedArrivalTime: String,
    verified: Boolean,
    verifiedAt: Date,
    confirmedAt: Date,
    confirmedBy: String,
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    cancelledBy: String,
  },
  {
    timestamps: true,
  },
);

reservationSchema.index.findByPhoneAndDate = {
  by: ['customer.phone', 'reservationDate'],
  type: 'n1ql',
};

reservationSchema.index.findByStatusAndDate = {
  by: ['status', 'reservationDate'],
  type: 'n1ql',
};

reservationSchema.index.findByStore = {
  by: ['storeId'],
  type: 'n1ql',
};

reservationSchema.index.findByUserId = {
  by: ['userId'],
  type: 'n1ql',
};

export const ReservationModel = ottomanInstance.model('Reservation', reservationSchema, {
  collectionName: 'Reservation',
});
