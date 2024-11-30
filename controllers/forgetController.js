import User from '../models/user.js';
import Otp from '../models/otpModel.js';  
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js'; 
import { sendOTPEmail } from '../config/mail.js';  
import bcrypt from 'bcrypt';



export const requestOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    await storeOTP(email, otp);
    
    // Attempt to send the email, handling errors specifically
    try {
      await sendOTPEmail(email, otp);
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      res.status(500).json({ message: 'Failed to send OTP email' });
    }
    
  } catch (error) {
    console.error('Error processing OTP request:', error);
    res.status(500).json({ message: 'Failed to process OTP request' });
  }
};



export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    
    const otpVerification = await verifyOTP(email, otp);
    if (!otpVerification.success) {
      return res.status(400).json({ message: otpVerification.message });
    }

    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);  

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};
