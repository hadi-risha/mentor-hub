import { Document } from 'mongoose';
import { ISession } from '../models/sessionModel';
import { IBooking } from '../models/bookingModel'



export interface IUser extends Document {
  googleId?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isRoleChanged: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpiry?: Date | null;

  about?: string;
  country?: string;
  occupation?: string;
  currentInstitution?: string;
  teachingViews?: string ;
  achievements?: string;
  education?: string;
  experience?: string;
  image?: {
    key?: string;
    url?: string;
  };
}

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserByGoogleId(googleId: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  updateUserVerification(email: string): Promise<IUser | null>;
  findUserByResetToken(token: string): Promise<IUser | null>;

  updateUserDetails(profileData: Partial<IUser>): Promise<IUser | null>;


  createSession(sessionData: ISession): Promise<ISession>;
  findSessionById(id: string): Promise<ISession | null>;

  updateSessionDetails(sessionData: Partial<ISession>): Promise<ISession | null>;
  deleteSessionById(id: string): Promise<boolean>;

  
  createBooking(bookingData: IBooking): Promise<IBooking>;

  fetchSessions(): Promise<ISession[] | null>;

  switchUserRole(id: string, newRole: string): Promise<IUser | null>;

  bookedSessions( id: string ): Promise<IBooking[] | null>;
  instructorBookedSessions( id: string ): Promise<IBooking[] | null>;


  instructorAvailableSessions( id: string ): Promise<ISession[] | null>;
  updateIsRoleChanged(id: string ): Promise<IUser | null>;


}
