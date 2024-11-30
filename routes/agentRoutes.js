import express from 'express';
import { createAgent, updateAgent } from '../controllers/AgentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating agent personal information
router.post('/create',authMiddleware, createAgent);

// Route for updating agent personal information by ID
router.put('/update', authMiddleware , updateAgent);

export default router;
