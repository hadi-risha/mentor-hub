import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpStatusCodes';
import { log } from "winston";
import { UserService } from '../services/userService';

const userService = new UserService();


interface IUserData {
    id: string;
    role: string;
    isBlocked: boolean;
    isRoleChanged: boolean;
}

export const checkUserRole = (uRole: string) =>  {
    // return (req: Request, res: Response, next: NextFunction): any => {
        return async (req: Request, res: Response, next: NextFunction): Promise<any> => { // Mark the function async

        if (!req.userData) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'No user data available' });
        }
        const {id, role, isBlocked, isRoleChanged } = req.userData as IUserData;


        console.log("user details in checkUserRole", req.userData);

        console.log("id from verify user tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", id);
        const existingProfile = await userService.findUserById(id);
        if (!existingProfile) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "User doesn't exist" });
        }

        console.log("check isBlocked accessible in checkUserRole : ", existingProfile.isBlocked);
        console.log("check isRoleChanged accessible in checkUserRole : ", existingProfile.isRoleChanged);

        if ( existingProfile.isBlocked ) {
            console.log("User account has been blocked");
            return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account has been blocked.", isBlocked: existingProfile.isBlocked });
        }

        if ( existingProfile.isRoleChanged ) {
            console.log("User role changed");
            const updateisRoleChanged = await userService.updateIsRoleChanged(id);   //change rolechanged to false
            console.log("updateisRoleChanged", updateisRoleChanged);
            return res.status(HttpStatus.FORBIDDEN).json({ message: "Your role has been changed. Please log in again.", isRoleChanged: true });
        }


        console.log("checkUserRole ------role from req", role);
        console.log("checkUserRole ------role from prop", uRole);

       
        
        
        if (typeof req.userData === 'object' && 'role' in req.userData) {
            const userRole = (req.userData as jwt.JwtPayload).role;
            if (role !== uRole) {
                return res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied, insufficient permissions' });
            }
            if (isBlocked) {
                return res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied: Your account has been temporarily blocked.' });
            }
        } else {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid user data structure' });
        }
        next();
    };
};
