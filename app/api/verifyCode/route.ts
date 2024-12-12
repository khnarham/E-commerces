import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/Types";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest)  {
   await dbConnect();
   try {
        const { userId, code } = await request.json();
        
     
        console.log('Received UserId:', userId);
        console.log('Received code:', code);

        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid UserId format',
            }, { status: 400 });
        }

    
        const User = await UserModel.findById(userId);
         
       
        if (!User) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            });
        }

       
        const isCodeValid = User.verifyCode === code;
        const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date();
         
        if (isCodeValid && isCodeNotExpired) {
            User.isVerified = true;
            await User.save();
            return NextResponse.json({
                success: true,
                message: 'User verified successfully',
                _id: User._id,
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: 'Code has expired',
            });
        }
        if (!isCodeValid) {
            return NextResponse.json({
                success: false,
                message: 'Invalid code',
            });
        }
        
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json(
          { success: false, message: 'Error verifying user' },
          { status: 500 }
        );
    }
}
