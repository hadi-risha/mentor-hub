// src/services/adminService.ts
import { AdminRepository } from '../repositories/adminRepository';
import { IAdmin } from '../interfaces/adminInterface';
import { IUser } from '../models/userModel';

export class AdminService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
        return this.adminRepository.createAdmin(adminData);
    }

    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        return this.adminRepository.findAdminByEmail(email);
    }

    async fetchUsers(): Promise<IUser[] | null> {
        return this.adminRepository.fetchUsers();
    }

    async updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null> {
        return this.adminRepository.updateUserBlockStatus(id, isBlocked);
    }

    async switchUserRole(id: string, newRole: string): Promise<IUser> {
        return this.adminRepository.switchUserRole(id, newRole)
    }
}
