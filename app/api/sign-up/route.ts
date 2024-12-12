import { sendVerificationEmail } from "@/helpers/sendEmailVerification";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt'; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log('POST request received'); 
    await dbConnect();
    
    try {
        const { username, email, Password } = await request.json();
        console.log('Parsed request body:', { username, email });  

        const existingUserbyEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('Generated verify code:', verifyCode);  

        if (existingUserbyEmail) {
            console.log('User found with email:', email);  
            if (existingUserbyEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    { status: 400 }
                );
            } else {
                console.log('Updating existing user for verification'); 
                const hashedPassword = await bcrypt.hash(Password, 10);
                existingUserbyEmail.Password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserbyEmail.isVerified = false;
             const ExistingUser = await existingUserbyEmail.save();             
             console.log('sendVerificationEmail called with:', {username, email, verifyCode });
                const emailResponse = await sendVerificationEmail({
                    ...ExistingUser.toObject(),
                    _id: ExistingUser._id.toString(),
                    verifyCode,
                });
    
                if (!emailResponse.success) {
                    console.error('Failed to send verification email');  
                    return NextResponse.json(
                        {
                            success: false,
                            message: "Failed to send verification email",
                        },
                        { status: 500 }
                    );
                }
                
                return NextResponse.json(
                    {
                        success: true,
                        message: "User updated successfully",
                        _id: existingUserbyEmail._id.toString(),
                    },
                    { status: 200 }
                );
            }
        } else {
            console.log('Creating new user');
            const hashedPassword = await bcrypt.hash(Password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                Password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });
            const user = await newUser.save();

            console.log('sendVerificationEmail called with:', {username, email, verifyCode });
       
            const emailResponse = await sendVerificationEmail({
                ...user.toObject(),
                _id: user._id.toString(),
                verifyCode,
            });

            if (!emailResponse.success) {
                console.error('Failed to send verification email');  
                return NextResponse.json(
                    {
                        success: false,
                        message: "Failed to send verification email",
                    },
                    { status: 500 }
                );
            }

            console.log('User created successfully:', user._id.toString());  
            return NextResponse.json(
                {
                    success: true,
                    message: "User created successfully",
                    _id: user._id.toString(),
                },
                { status: 201 } 
            );
        }
    } catch (error) {
        console.error('Error in Registering User', error); 
        return NextResponse.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}