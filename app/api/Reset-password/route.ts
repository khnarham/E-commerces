import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { Token, Password } = await request.json();
        console.log('verify:', Token);
        console.log('Password:', Password);
        
        console.log('UserModel:',UserModel);
        
        const user = await UserModel.findOne({resetPasswordToken: Token});

        console.log('User:' , user);
        if (!user) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }
        
        
        if (new Date(user.resetPasswordExpires!) <= new Date()) {
            return NextResponse.json(
                { message: "Token has expired" },
                { status: 401 }
            );
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        user.Password = hashedPassword;
        user.resetPasswordToken =  undefined,
        user.resetPasswordExpires = undefined;

        await user.save();
        
        return NextResponse.json(
            { message: "Password has been changed successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
