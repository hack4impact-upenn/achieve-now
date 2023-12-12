/**
 * Interface for the user data type return from the backend
 */
interface IUser {
  id: any;
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

export default IUser;
