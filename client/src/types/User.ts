//for registration purpose
export interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginData {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
}

export interface IUserRole {
    role: string | null; 
}