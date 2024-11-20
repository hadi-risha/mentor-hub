import { IAdmin, IAdminRepository } from '../interfaces/adminInterface';
import { Admin } from '../models/adminModel';
import { IUser, UserModel } from '../models/userModel';

export class AdminRepository implements IAdminRepository {

    async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
        try {
            const newAdmin = new Admin(adminData);
            return await newAdmin.save() as IAdmin;
        } catch (error) {
            throw new Error(`Error creating admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        try {
            return await Admin.findOne({ email });
        } catch (error) {
            throw new Error(`Error finding admin by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async fetchUsers(): Promise<IUser[] | null> {
        try {
            return await UserModel.find().sort({ createdAt: -1 })
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null> {
        try {
            return await UserModel.findByIdAndUpdate(id, { isBlocked }, { new: true }); // The { new: true } option returns the updated document
        } catch (error) {
            throw new Error(`Failed to update user block status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    async switchUserRole(id: string, newRole: string): Promise<IUser> {
        try {
            console.log("in admin update user role repository");
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



    
}
