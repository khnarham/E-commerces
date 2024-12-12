import mongoose from "mongoose";
import { Schema } from "mongoose";
import { string } from "zod";


export interface User extends Document {
    _id: string;
    username: string;
    email: string;
    Password: string;
    verifyCode: string;
    verifyCodeExpiry: Date; 
    resetPasswordToken: string | undefined ;
    resetPasswordExpires: Date | undefined;
    isVerified: boolean;
  }
const UserSchema: Schema<User> = new mongoose.Schema({
      username: {
        type: String,
        required: [true , 'Username is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
      },
      Password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long']
      },
      verifyCode:{
        type: String,
        required: [true , 'Verifu Code is reqired']
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
      resetPasswordToken: String,

      resetPasswordExpires:  Date,
      
      isVerified:{
        type: Boolean,
        default: false
      }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;