import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { RequestResponse } from "@/types/Types";
import { NextRequest, NextResponse } from "next/server";
import crypto, { verify } from 'crypto';
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";
import { ResetEmail } from "@/helpers/ResetEmail";






export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const { email } = await request.json();
    const User = await UserModel.findOne({ email: email });

    if (!User) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      });
    }

 
    const token = crypto.randomBytes(32).toString('hex');
    User.resetPasswordToken = token;
    
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    User.resetPasswordExpires = expiryDate;
                                        
   const Email =  await User.save();

       const RestMail = await ResetEmail({
         _id: Email._id.toString(),
         verifyToken: token ,
         email: Email.email,
         username: Email.username,

       })

      if(RestMail.success){
        return NextResponse.json({
          success: true,
          message: 'Reset token generated successfully',
          data: User
        });
      }
  


  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error in processing request',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

