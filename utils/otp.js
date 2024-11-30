import crypto from 'crypto';
import Otp from '../models/otpModel.js';  

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999);  
};

export const storeOTP = async (email, otp) => {
  try {
    
    await Otp.upsert({
      email,
      otp,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Error storing OTP');
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    
    const storedOTP = await Otp.findOne({ where: { email } });
    // console.log(storedOTP);
    

    
    if (storedOTP) {
   
      if (Date.now() - new Date(storedOTP.timestamp).getTime() > 600000) {
        await storedOTP.destroy();  
        return { success: false, message: 'OTP has expired' };
      }

      
      if (storedOTP.otp === otp) {
        return { success: true };
      } else {
        return { success: false, message: 'Invalid OTP' };
      }
    } else {
      return { success: false, message: 'No OTP found for this email' };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Error verifying OTP');
  }
};
