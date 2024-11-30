import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.js';
import AgentPersonalInfo from '../models/agent.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword, phone,role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if(existingUser){
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user',
    });
    res.status(200).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});



router.post('/agentregister', async (req, res) => {
  const { fullName, companyName, phone, email, agencyLicenseNumber, password, confirmPassword } = req.body;
console.log(req.body);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check for email already exists in Users table
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user first
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'agent', // Set the role as 'agent'
    });

    // Now create the agent profile, linked to the new user
    const agentPersonalInfo = await AgentPersonalInfo.create({
      fullName,
      companyName,
      phone,
      email,
      agencyLicenseNumber,
      password: hashedPassword,  
      userId: newUser.id,  // Linking agent to the newly created user
    });
    res.status(200).json({ message: 'Registration successful', agentPersonalInfo });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    
    let loginMessage;
    if (user.role === 'admin') {
      loginMessage = 'admin login successful';
    } else if (user.role === 'agent') {
      loginMessage = 'agent login successful';
    } else {
      loginMessage = 'user login successful';
    }
    res.status(200).json({ message: loginMessage, token ,userId: user.id,
      role: user.role,});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
