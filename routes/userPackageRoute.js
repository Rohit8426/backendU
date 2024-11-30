import express from 'express';
import { userAllPackages ,getPackageDetails} from "../controllers/userPackageController.js";

const router = express.Router();

router.get("/userPackages" , userAllPackages);

router.get('/packages/:packageId', getPackageDetails);

export default router;