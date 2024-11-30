import express from 'express';
import { createBooking } from '../controllers/userbookingController.js';
import {authMiddleware }from '../middleware/authMiddleware.js';
import getAgentBookings from '../controllers/AgentBookingsController.js';

const router = express.Router();


router.post('/bookings', authMiddleware, createBooking);


router.get('/agentBooking' , authMiddleware , getAgentBookings)

export default router;

