import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { UserService } from '../services/userService';
import { HttpStatus } from '../utils/httpStatusCodes';
import { generateOtp, verifyOtp } from '../utils/otpService';
import { sendOtpEmail } from '../utils/otpEmailService';
import { generateResetPasswordToken,sendForgotPasswordEmail  } from '../utils/forgotPswService';
import config from '../config/config';



export class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /* SIGNUP */
    public async signup(req: Request, res: Response): Promise<Response> {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Passwords do not match' });
        }

        const passwordPattern = /^.{8,}$/; 
        if (!passwordPattern.test(password)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Password must be at least 8 characters long.' });
        }

        try {
            const existingUser = await this.userService.findUserByEmail(email);
            if (existingUser) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await this.userService.createUser({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: 'student',
                isVerified: false,
            });

            const otp = generateOtp(email);
            console.log("generate OTP and send email");
            await sendOtpEmail(email, otp);
            console.log("otp mail sended");

            return res.status(HttpStatus.OK).json({ message: 'Signup successful, please verify your OTP' });
        } catch (error: any) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error signing up', error: error.message });
        }
    }


    /* VERIFY OTP */
    public async verifyUserOtp(req: Request, res: Response) {
        console.log("Received OTP verification request:", req.body);
        console.log("verify otp section", req.body.otp);
        
        const { email, otp } = req.body;
    
        console.log("typeof otp",typeof otp);
        console.log("otp", otp);
        try {
            console.log("verifyUserOtp try block");
            
            if (verifyOtp(email, otp)) {
                console.log("verifyUserOtp email, otp", email, otp);
                const updatedUser = await this.userService.updateUserVerification(email);

                console.log("updatedUser", updatedUser);
                
    
                const existingUser = await this.userService.findUserByEmail(email);
                console.log("existingUser in verify user", existingUser);
                
                if (!existingUser) {
                    
                    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'user doesnt exists' });
                }
                const token = jwt.sign({ id: existingUser._id, role: existingUser.role, userDetails: req.userData }, config.jwtSecret as string);
                const userWithoutPassword = existingUser.toObject();  
                delete userWithoutPassword.password; 
    
                console.log("token, userData: userWithoutPassword", token, userWithoutPassword);
                
                
                return res.status(HttpStatus.OK).json({ message: 'OTP verified successfully', user: updatedUser, token, userData: userWithoutPassword });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'The OTP is not valid. Please re-enter it.' });
            }
        } catch (error: any) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error verifying OTP', error: error.message });
        }
    

    }

    /* VERIFY ACCOUNT IN LOGIN */
    public async verifyNow(req: Request, res: Response): Promise<Response> {
        console.log("verifyNow section server side");
        
        const { email } = req.body;
        console.log(email);
        
        console.log(email );
        try {
            const existingUser = await this.userService.findUserByEmail(email);
            if (!existingUser) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'user doesnt exists' });
            }

            const otp = generateOtp(email);
            console.log("otp in verify now section", otp);
            
            console.log("generate OTP and send email");
            await sendOtpEmail(email, otp);
            console.log("otp mail sended");

            return res.status(HttpStatus.OK).json({ message: 'verify now, otp send to email,please verify your OTP' });
        } catch (error:any) {
            console.log("error in verify now server side");
            
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error in verify now', error: error.message });
        }
    };


    /* RESEND OTP */
    public async resendOTP(req: Request, res: Response): Promise<Response> {
        console.log("resend otp section");
        
        const { email } = req.body;
        console.log(email);
        try {
            const existingUser = await this.userService.findUserByEmail(email);
            if (!existingUser) { 
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'user does not exist' });
            }

            if (existingUser.isVerified) {
                return res.status(HttpStatus.CONFLICT).json({ message: 'user is already verified' });
            }

            //generate OTP and send email
            const otp = generateOtp(email);
            console.log("Generated OTP:", otp);

            await sendOtpEmail(email, otp);
            console.log("OTP email sent successfully");

            return res.status(HttpStatus.OK).json({ message: 'OTP resent successfully, please verify your OTP.' });
        } catch (error: any) {
            console.error('error in resending OTP:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error in resending OTP', error: error.message });
        }
    };

    /* LOGGING IN */
    public async login(req: Request, res: Response): Promise<Response> {
        console.log("comes here in login page.");
        
        try {
            const { email, password } = req.body;
            console.log("login email, password", email, password);
            
            const existingUser = await this.userService.findUserByEmail(email);
            if (!existingUser) {
                console.log("User doesn't exist. Please recheck your email.");
                
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "User doesn't exist. Please recheck your email." });
            }

            if (!existingUser.password) {
                console.log("Password not set for user, cannot log in.");
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Password not set for this user." });
            }

            const isMatch = await bcrypt.compare(password, existingUser.password);
            console.log("password match:", isMatch);
            if (!isMatch) {
                console.log("invalid credentials/ psw");
                
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "invalid credentials." });
            }

            if (!existingUser.isVerified) {
                console.log("user didn't verify, please verify to login");
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Please verify your email to log in.", needsVerification: true  });
            }

            console.log("user details in login", req.userData);
            

            const token = jwt.sign({ id: existingUser._id, role: existingUser.role, userDetails: req.userData }, config.jwtSecret as string);
            const userWithoutPassword = existingUser.toObject();  
            delete userWithoutPassword.password; 

            let homePageUrl = '';
            if (existingUser.role === 'student') {
                console.log("redirect to --> student home");
                homePageUrl = '/student/home';
            } else if (existingUser.role === 'instructor') {
                console.log("redirect to --> instructor home");
                homePageUrl = '/instructor/home';
            }

            console.log("redirect to -->", homePageUrl);

            console.log("token, homePageUrl, userData: userWithoutPassword", token, homePageUrl, userWithoutPassword);
            
            // return res.status(HttpStatus.OK).json({ message: 'login successful', token, homePageUrl, userData: userWithoutPassword }); 
            return res.status(HttpStatus.OK).json({ message: 'login successful', token, role: existingUser.role, userData: userWithoutPassword });  
 
        } catch (error: any) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    };


    /* LOG OUT */
    public async logout(req: Request, res: Response): Promise<Response> {
        const token = req.header("Authorization")?.split(" ")[1];
    
        if (token) {
        res.clearCookie("token");
    
        return res.status(HttpStatus.OK).json({ message: "Logout successful" });
        } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "No token found, cannot log out" });
        }
    };


    /* REQUEST RESET PSW  */
    public async requestPasswordReset(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Oops! That email isn’t registered with us.' });
            }
            const resetToken = generateResetPasswordToken();
            console.log("pasw reset token ....", resetToken);
            
            user.resetPasswordToken = resetToken;
            // user.resetPasswordExpiry = new Date(Date.now() + 300000);   //expire after 5 minutes
            user.resetPasswordExpiry = new Date(Date.now() + 600000);   //  10 minutes
    
            await user.save();
    
            // const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;    
            const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;   //frontend url

    
            await sendForgotPasswordEmail(email, resetUrl);
            return res.status(HttpStatus.OK).json({ message: "Password reset email sent! Please check your email for the reset link." , resetToken});
      } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error in forgot-psw '});
      }
    };


    /* RESET PSW  */
    public async resetUserPassword(req: Request, res: Response) {
        console.log("resetUserPassword s    Q   Aection");
        
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
    
        console.log( "token.....", token );
        console.log( "password, confirmPassword.....", password, confirmPassword );
        console.log("1");
        
    
        if (!password || !confirmPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'All fields are required' });
        }
        console.log("2");
    
        if (password !== confirmPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Passwords do not match' });
        }
        console.log("3");
        try {
            const user = await this.userService.findUserByResetToken(token);
            console.log("4");
            if (!user) {
                console.log("4.5", user);
                
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid or expired token" });
            }
            console.log("5");
            if (user === null) {
                console.log("4.8", user);
                console.log("invalid reset link");
                
                
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "invalid reset link" });
            }
    
            console.log(`User ${user.email} found, resetting password`);                                                                                                                                                                                    
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            user.password = hashedPassword;
            user.resetPasswordToken = null; 
            user.resetPasswordExpiry = null;
            console.log("6");
    
            await user.save();
            console.log("user saved");
            console.log("7");
            
    
            res.status(HttpStatus.OK).json({ message: 'Password reset successful' });
        } catch (err) {
            console.log("8 err");
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    };


}
