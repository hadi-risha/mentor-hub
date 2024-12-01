import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpStatusCodes';
import config from '../config/config';
import { UserService } from '../services/userService';
import { log } from 'winston';


const userService = new UserService();

/* COMMON AUTH MIDDLEWARE */
declare module 'express-serve-static-core' {
  interface Request {
    userData?: string | jwt.JwtPayload;
  }
}



interface IUserData {
    id: string;
    isBlocked: boolean;
    isRoleChanged: boolean;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("user details in verify token", req.userData);
    try {
        console.log("in verify token part");
        
        let token = req.header("Authorization"); 
        console.log("token in verify user", token);
        
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'access denied, no token provided' });
        }

        // const { id } = req.userData as IUserData;

        // console.log("id from verify user tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", id);
        

        


        if (token.startsWith("Bearer ")) {  
            token = token.slice(7, token.length).trimLeft();
        }

        const secret = config.jwtSecret;
        if (!secret) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'JWT secret is not defined in env' });
        }

        //verify the token using the secret
        const verified = jwt.verify(token, secret);

        
        
        req.userData = verified;  
        console.log("in auth.ts     req.userData.......", req.userData);
        console.log("user info from verifytoken", req.userData);
        
        next(); 
    } catch (err) {
        if (err instanceof Error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "an unknown error occurred" });
    }
};



