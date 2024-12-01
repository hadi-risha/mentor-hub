import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/adminTokenService";
import { AdminService } from '../services/adminService'
import config from "../config/config";
import { HttpStatus } from '../utils/httpStatusCodes';
import { UserService } from "../services/userService";





export class AdminController {
  private adminService: AdminService;

  constructor() {
      this.adminService = new AdminService();
  }




  /* ADMIN LOGGING IN */
  public async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log("admin login credentialss", email, password);
    try {
      if (!email || !password) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: "All fields are required" });
        }

      let admin = await this.adminService.findAdminByEmail(email);
      
      if (!admin) {
          if (config.adminEmail === email && config.adminPass === password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            admin = await this.adminService.createAdmin({ email, password: hashedPassword });
            console.log("First-time admin created successfully!");
    
            const token = generateToken(admin._id.toString());
            return res.status(HttpStatus.CREATED).json({ message: "Admin account created", token });
          } else {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Invalid credentials" });
          }
        }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid credentials" });
      }

      const token = generateToken(admin._id.toString());
      return res.status(HttpStatus.OK).json({ message: "Admin login successful", token });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
  }


  /* FETCH ALL USERS */
  public async fetchUsers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { isBlocked } = req.body;
    try {
      const users = await this.adminService.fetchUsers();
      return res.status(HttpStatus.OK).json({ message: "Sessions successfully fetched", users });
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch users",error: error.message});

    }
  }



   /* UPDATE BLOCK STATUS */
   public async toggleUserBlock(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid block status. Expected a boolean value.' });
    }


    try {
      const user = await this.adminService.updateUserBlockStatus(id, isBlocked);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
      }

      return res.status(HttpStatus.OK).json({ message: "User block status updated successfully.", user });
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to update block status",error: error.message});

    }
  }



  public async switchUserRole(req: Request, res: Response): Promise<Response> {
    const { id, newRole } = req.body;
    try {
      const updatedUser = this.adminService.switchUserRole(id, newRole)
      console.log("updatedUser-----------", updatedUser);

      if (!updatedUser) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
      }
      
      return res.status(HttpStatus.CREATED).json({ message: "User role updated successfully", ...updatedUser });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating user role:" });
    }



  }



 



};



