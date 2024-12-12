import { ObjectId } from "mongoose";
import 'next-auth';

export interface  AuthParams {
    type: 'SignUp' | 'Login' 
}

export interface User {
   _id: string,
    username: string;
    email: string;
    Password: string;
    verifyCode: string;
    resetPasswordToken?: String;
    resetPasswordExpires?: Date;
    verifyCodeExpiry: Date; 
    isVerified: boolean;

}



export interface ApiResponse {
  success: boolean;
  message: string;
  _id: string,
};





import 'next-auth';
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }

    interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}


export interface Credentials {
  email: string;
  Password: string;
  
}

export interface Userwithtoken {
  username: string;
  email: string;
  Password: string;
  verifyCode: string;
  resetPasswordToken: String;
  resetPasswordExpires: Date;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
}

export interface RequestResponse {
  success: boolean;
  messages: string;
  data?: Userwithtoken,
}