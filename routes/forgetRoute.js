import express from 'express';
import { requestOTP, resetPassword } from '../controllers/forgetController.js';  

const router = express.Router();

router.post('/forgot-password', requestOTP);


router.post('/reset-password', resetPassword);

export default router;
