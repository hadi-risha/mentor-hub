import { ObjectId } from "mongoose";
import { IUser } from "../models/userModel";


export interface IAdmin {
    _id: ObjectId;
    email: string;
    password: string;
}

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<IAdmin | null>;
    createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin>;
    fetchUsers(): Promise<IUser[] | null>;
    updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null>; // Add parameters

    switchUserRole(id: string, newRole: string): Promise<IUser | null>;



}

export interface IAdminService {
    login(email: string, password: string): Promise<{ message: string; token?: string }>;
}
