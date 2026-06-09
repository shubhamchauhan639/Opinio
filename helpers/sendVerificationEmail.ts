import {resend} from '@/lib/resend';
import VerificationEmail from '@/emails/verificationEmail';
import {ApiResponse} from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try{
         const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
         await resend.emails.send({
      from: 'no-reply@patelvivek.dev',
      to: email,
      subject: 'Verification Code',
      react: VerificationEmail({ BASE_URL, username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };

    }
    catch (error) {
        console.error('Error sending verification email', error);
        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}


