import express from 'express';
import  comparePackage  from '../controllers/compareController.js';
const router = express.Router();


router.post('/comparePackage' , comparePackage)

export default router;