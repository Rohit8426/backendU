import express from 'express';
import { getPreviousPackage } from '../controllers/previousPackageController.js';

const router = express.Router();

router.get('/previous' ,getPreviousPackage);

export default router;