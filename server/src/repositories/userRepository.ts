import { IUser, IUserRepository } from '../interfaces/userInterface';
import { UserModel } from '../models/userModel';
import { ISession, SessionModel } from '../models/sessionModel';
import { BookingModel, IBooking } from '../models/bookingModel'




export class UserRepository implements IUserRepository {

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            console.log("in create user repository");
            
            const newUser = new UserModel(userData); 
            console.log("newUser:- ", newUser);
            
            return await newUser.save();  
        } catch (error) {
            throw new Error(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findUserByGoogleId(googleId: string): Promise<IUser | null> {
        try {
            return await UserModel.findOne({ googleId });
        } catch (error) {
            throw new Error(`Error finding user by Google ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findUserById(id: string): Promise<IUser | null> {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updateUserVerification(email: string): Promise<IUser | null> {
        try {
            return await UserModel.findOneAndUpdate(
                { email },
                { isVerified: true },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating user verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findUserByResetToken(token: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ resetPasswordToken: token });
            if (user) {
                if (user.resetPasswordExpiry && user.resetPasswordExpiry < new Date()) {
                    // Token expired
                    user.resetPasswordToken = null;
                    user.resetPasswordExpiry = null;
                    await user.save(); 
                    return null; 
                }
                return user; 
            }
            return null; 
        } catch (error) {
            throw new Error(`Error finding user by reset token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }



    async updateUserDetails(profileData: IUser): Promise<IUser> {
        try {
            console.log("in update profile repository");
            const updatedProfile = await UserModel.findByIdAndUpdate(profileData._id, profileData, { new: true }).exec();
        
            if (!updatedProfile) {
                console.log("Profile not found");
                throw new Error("Profile not found");
            }
        
            return updatedProfile;
        } catch (error) {
            throw new Error(`Error updating user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async createSession(sessionData: Partial<ISession>): Promise<ISession> {
        try {
            console.log("in create user repository");
            
            const newSession = new SessionModel(sessionData); 
            console.log("newSession:- ", newSession);
            
            return await newSession.save();  
        } catch (error) {
            throw new Error(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }





    async findSessionById(id: string): Promise<ISession | null> {
        try {
            return await SessionModel.findById(id)
            .populate({
                path: 'instructorId',
                select: '_id firstName lastName image.url', // Only fetch the required fields
            });
        } catch (error) {
            throw new Error(`Error finding session by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }




    


    async updateSessionDetails(sessionData: ISession): Promise<ISession> {
        try {
            console.log("in update session data repository");
            const updatedSession = await SessionModel.findByIdAndUpdate(sessionData._id, sessionData, { new: true }).exec();
        
            if (!updatedSession) {
                console.log("Session not found");
                throw new Error("Session not found");
            }
            return updatedSession;
        } catch (error) {
            throw new Error(`Error updating user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    

    async deleteSessionById(id: string): Promise<boolean> {
        const deletedSession = await SessionModel.findByIdAndDelete(id);
        return !!deletedSession; // Returns true if a session was deleted, otherwise false
    }




    async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
        try {
            console.log("in create booking repository");
            
            const newBooking = new BookingModel(bookingData); 
            console.log("newBooking:- ", newBooking);
            
            return await newBooking.save();  
        } catch (error) {
            throw new Error(`Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }



    async fetchSessions(): Promise<ISession[] | null> {
        try {
            return await SessionModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'instructorId',
                select: 'firstName lastName', // Only fetch the required fields
            });
        } catch (error) {
            throw new Error(`Failed to fetch sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async switchUserRole(id: string, newRole: string): Promise<IUser> {
        try {
            console.log("in update user role repository");
            const updatedUser = await UserModel.findByIdAndUpdate(id, { role: newRole },{ new: true }).exec();
        
            if (!updatedUser) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user role: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async bookedSessions(studentId: string): Promise<IBooking[] | null> {
        try {
            return await BookingModel.find({ studentId }) // Ensure `studentId` is passed as an object
            .sort({ createdAt: -1 }) // Sort bookings by creation date, descending
            .populate({
                path: 'instructorId', // Populate instructor details
                select: 'firstName lastName email', // Fetch only necessary fields
            })
            .populate({
                path: 'sessionId', // Populate session details
                select: '_id title duration fee descriptionTitle coverImage.url', // Fetch required fields
            });

        } catch (error) {
            throw new Error(`Failed to fetch bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async instructorBookedSessions(id: string): Promise<IBooking[] | null> {
        try {
            return await BookingModel.find({ instructorId: id }) // Ensure `studentId` is passed as an object
            .sort({ createdAt: -1 }) // Sort bookings by creation date, descending
            .populate({
                path: 'studentId', // Populate instructor details
                select: '_id firstName lastName email', // Fetch only necessary fields
            })
            .populate({
                path: 'instructorId', // Populate instructor details
                select: 'firstName lastName email', // Fetch only necessary fields
            })
            .populate({
                path: 'sessionId', // Populate session details
                select: '_id title duration fee descriptionTitle', // Fetch required fields
            });

        } catch (error) {
            throw new Error(`Failed to fetch bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async instructorAvailableSessions(id: string): Promise<ISession[] | null> {
        try {
            return await SessionModel.find({ instructorId:id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'instructorId',
                select: '_id firstName lastName email',
            });

        } catch (error) {
            throw new Error(`Failed to fetch sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async updateIsRoleChanged(id: string): Promise<IUser | null> {
        try {
            return await UserModel.findOneAndUpdate(
                { _id: id },
                { isRoleChanged: false },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating user verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async findBookingById(id: string): Promise<IBooking | null> {
        try {
            return await BookingModel.findById(id)
        } catch (error) {
            throw new Error(`Error finding booking by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async searchSessions(query: string): Promise<ISession[] | null> {
        try {
          const searchRegex = new RegExp(query, 'i'); // Case-insensitive regex for partial matches
          return await SessionModel.find({
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { "instructorId.firstName": searchRegex },
              { "instructorId.lastName": searchRegex },
              { "category": searchRegex }
            ],
          })
            .populate({
              path: 'instructorId',
              select: 'firstName lastName email', // Fetch required instructor fields
            })
            .sort({ createdAt: -1 }); // Sort results by creation date
        } catch (error) {
          throw new Error(`Failed to perform search: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    
}
