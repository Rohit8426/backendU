import express from 'express';
import  User  from '../models/user.js';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user.id,
      firstname:user.firstname,
      lastname:user.lastname,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({ user:userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
    const {firstname , lastname , email , password  , phone , role } = req.body;
    const userId = req.user.userId;
    try {

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.firstname = firstname 
      user.lastname = lastname 
      user.email = email 
      user.password = password
      user.role = role || user.role;
      user.phone = phone || user.phone


      if (password) {
        const salt = await bcrypt.genSalt(10);  // Generate salt
        user.password = await bcrypt.hash(password, salt);  // Hash the password
      }

      await user.save();
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
router.delete('/delete', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  export default router;