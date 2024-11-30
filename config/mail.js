import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true, 
  auth: {
    user:process.env.Email,
    pass:process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from:process.env.Email,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });
    console.log('OTP sent to email:', email);
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};
