import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try{
        const { username, email, password } = await request.json();
        const existingUser = await userModel.findOne({username , isVerified: true});
        if (existingUser) {
            return Response.json({ success: false, message: 'Username already exists' }, { status: 400 });
        }
        const existingUserByEmail = await userModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail){
          if(existingUserByEmail.isVerified){
            return Response.json({ success: false, message: 'Email already in use' }, { status: 400 });}
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 360000); // 1 hour from now
                await existingUserByEmail.save();
            }
        }
    
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);
          const newUser =   new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifiedCodeExpiry: expiryDate,
                isVerified : false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        } 
      const emailResponse =    await sendVerificationEmail(email, username,verifyCode);
      if(!emailResponse.success){
        return Response.json({ success: false, message: emailResponse.message }, { status: 500 });

      }
        return Response.json({ success: true, message: 'User registered successfully. Please check your email for the verification code.' }, { status: 201 });
    }
    catch(error){
        console.error('Error in sign-up route', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });

    }
}

