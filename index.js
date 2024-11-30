import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';



import { connectDB } from './config/database.js';
import User from './models/user.js';
import authRoutes from './routes/authLogin.js';
import userRoutes from './routes/user.js';
import forgetRoutes from './routes/forgetRoute.js';
import models from './models/syncAll.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import agentInfoRoutes from './routes/agentRoutes.js';
import getPreviousPackage  from './routes/previousPackagesRoute.js'
import userAllPackages  from './routes/userPackageRoute.js';
import setupAssociations from './models/associations.js';
import agentBooking from './routes/agentBookingRoutes.js';
import comparePackages from './routes/compareRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import cors from 'cors';



dotenv.config();
const app = express();

const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: 'https://umrah-user.codemeg.com/login', // Allow all origins; adjust this based on your needs
    methods: ['GET', 'POST'],
  },
});


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(cors());

connectDB();
setupAssociations();

const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const adminExists = await User.findOne({ where: { email: adminEmail, role: 'admin' } });
    if (!adminExists) {
      const hashedPassword =await bcrypt.hash(adminPassword, 10);
      await User.create({
        firstname: 'Admin',
        lastname: 'User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};


initializeAdmin();
models;

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api' , forgetRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/agent-info', agentInfoRoutes);
app.use('/api/packages' , getPreviousPackage)
app.use('/api' , userAllPackages)
app.use('/api' , bookingRoutes)
app.use('/api', agentBooking)
app.use('/api' , comparePackages)
app.use('/api/messages', messageRoutes);




io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinGroup', async ({ groupId, userId }) => {
    const groupExists = await Group.findByPk(groupId);
    if (!groupExists) {
      return socket.emit('error', { message: 'Group not found.' });
    }
    socket.join(`group-${groupId}`);
    io.to(`group-${groupId}`).emit('notification', `User ${userId} joined.`);
  });
  
  // Send a message
  socket.on('sendMessage', async ({ senderId, groupId, content, messageType, attachments }) => {
    const message = await MessageController.createMessage({ senderId, groupId, content, messageType, attachments });
    io.to(`group-${groupId}`).emit('newMessage', message);
  });
  

  // Mark a message as read
  socket.on('markMessageAsRead', async ({ messageId }) => {
    try {
      const message = await MessageController.markMessageAsRead(messageId);
      socket.emit('messageRead', { messageId, isRead: message.isRead });
    } catch (error) {
      console.error('Error marking message as read:', error);
      socket.emit('error', { message: 'Failed to mark message as read.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});




const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

