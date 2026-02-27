import { Schema } from 'ottoman';
import { ottomanInstance } from '@/couchbase/ottoman-instance';
import { UserRole } from '@repo/schemas';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index.findByEmail = {
  by: ['email'],
  type: 'n1ql',
};

userSchema.index.findByPhone = {
  by: ['phone'],
  type: 'n1ql',
};

export const UserModel = ottomanInstance.model('User', userSchema, {
  collectionName: 'User',
});
