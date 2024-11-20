import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpStatusCodes';
import { log } from "winston";



interface IUserData {
    id: string;
    role: string;
  }
export const checkUserRole = (uRole: string) =>  {
    return (req: Request, res: Response, next: NextFunction): any => {
        if (!req.userData) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'No user data available' });
        }


        const {id, role } =req.userData as IUserData;
        console.log("checkUserRole ------role from req", role);
        console.log("checkUserRole ------role from prop", uRole);
        
        if (typeof req.userData === 'object' && 'role' in req.userData) {
            const userRole = (req.userData as jwt.JwtPayload).role;
            if (role !== uRole) {
                return res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied, insufficient permissions' });
            }
        } else {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid user data structure' });
        }

        next();
    };
};
