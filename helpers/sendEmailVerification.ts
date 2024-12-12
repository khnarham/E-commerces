import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { generateVerificationEmail } from "@/emails/VerificationEmail"; 
import { User } from "@/types/Types";
require('dotenv').config();


export async function sendVerificationEmail({
  _id,
  username,
  email,
  verifyCode,
}: User) {
  console.log('sendVerificationEmail function called');  

  console.log(process.env.EMAIL_KEY, process.env.PASSW0RD);



  try {
 

 
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_KEY,
        pass: process.env.PASSW0RD,
      },
    });

   
    const response = await transport.sendMail({
      from: process.env.EMAIL_KEY ,
      to: email,
      subject: 'Mystery Message Verification Code',
      html: generateVerificationEmail({username , _id , otp: verifyCode}), 
    });

    console.log('Email sent response:', response); 

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);  
    return { success: false, message: 'Failed to send verification email.' };
  }
}