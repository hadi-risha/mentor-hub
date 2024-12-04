// src/services/userService.ts
import { UserRepository } from '../repositories/userRepository';
import { IUser } from '../interfaces/userInterface';
import { ISession } from '../models/sessionModel';
import { IBooking } from '../models/bookingModel'
import { IRating } from '../models/ratingModel';

// import {IProfile} from '../models/userProfile'

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        console.log("in createUser service");
        return this.userRepository.createUser(userData);
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findUserByEmail(email);
    }

    async findUserByGoogleId(googleId: string): Promise<IUser | null> {
        return this.userRepository.findUserByGoogleId(googleId);
    }

    async findUserById(id: string): Promise<IUser | null> {
        return this.userRepository.findUserById(id);
    }

    async updateUserVerification(email: string): Promise<IUser | null> {
        return this.userRepository.updateUserVerification(email);
    }

    async findUserByResetToken(token: string): Promise<IUser | null> {
        return this.userRepository.findUserByResetToken(token);
    }


    async updateUserDetails(profileData: IUser): Promise<IUser> {
        return this.userRepository.updateUserDetails(profileData)
    }
    
    async createSession(sessionData: Partial<ISession>): Promise<ISession> {
        return this.userRepository.createSession(sessionData)
    }

    async findSessionById(id: string): Promise<ISession | null> {
        return this.userRepository.findSessionById(id);
    }

    async updateSessionDetails(sessionData: ISession): Promise<ISession> {
        return this.userRepository.updateSessionDetails(sessionData)
    }

    async deleteSessionById(id: string): Promise<boolean> {
        return this.userRepository.deleteSessionById(id); 
    }

    async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
        return this.userRepository.createBooking(bookingData)
    }  

    async fetchSessions(): Promise<ISession[] | null> {
        return this.userRepository.fetchSessions();
    }

    // async fetchSingleSessions(): Promise<ISession | null> {
    //     return this.userRepository.fetchSingleSessions();
    // }

    async switchUserRole(id: string, newRole: string): Promise<IUser> {
        return this.userRepository.switchUserRole(id, newRole)
    }

    async bookedSessions(studentId: string): Promise<IBooking[] | null> {
        return this.userRepository.bookedSessions(studentId);
    }

    async instructorBookedSessions(istructorId: string): Promise<IBooking[] | null> {
        return this.userRepository.instructorBookedSessions(istructorId);
    }

    async instructorAvailableSessions(istructorId: string): Promise<ISession[] | null> {
        return this.userRepository.instructorAvailableSessions(istructorId);
    }

    async updateIsRoleChanged(id: string ): Promise<IUser | null> {
        return this.userRepository.updateIsRoleChanged(id)
    }

    
    async findBookingById(id: string): Promise<IBooking | null> {
        return this.userRepository.findBookingById(id);
    }

    async searchSessions(query: string, studentId: string ): Promise<ISession[] | null> {
        return this.userRepository.searchSessions(query, studentId);
    }

    async instructorSearchSessions(query: string, instructorId: string ): Promise<ISession[] | null> {
        return this.userRepository.instructorSearchSessions(query, instructorId);
    }

    async sessionHistory(userId: string): Promise<IBooking[] | null> {
        return this.userRepository.sessionHistory(userId);
    }
    async instructorSessionHistory(userId: string): Promise<IBooking[] | null> {
        return this.userRepository.instructorSessionHistory(userId);
    }

    async pendingSessions(studentId: string): Promise<IBooking[] | null> {
        return this.userRepository.pendingSessions(studentId);
    }

    async rateInstructor( ratingData: Partial<IRating> ): Promise<IRating | null> {
        return this.userRepository.rateInstructor(ratingData)
    }

}
