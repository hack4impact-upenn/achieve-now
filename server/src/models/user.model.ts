/**
 * Defines the User model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    match:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g,
  },
  phone: {
    type: String,
    required: false,
    match: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationToken: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  resetPasswordToken: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  resetPasswordTokenExpiryDate: {
    type: Date,
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    enum: ['parent', 'coach', 'teacher', 'admin'],
    required: true,
  },
});

interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;
  verificationToken: string | null | undefined;
  resetPasswordToken: string | null | undefined;
  resetPasswordTokenExpiryDate: Date | null | undefined;
  active: boolean;
  role: string;
}

const User = mongoose.model<IUser>('User', UserSchema);

export { IUser, User };
