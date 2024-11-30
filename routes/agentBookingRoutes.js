import express from 'express';
import {getAgentBookings , approveBooking} from '../controllers/AgentBookingsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/agent/bookings',authMiddleware, getAgentBookings);

router.post('/approve/:bookingId', authMiddleware, approveBooking);

export default router;
