import express from 'express';
import { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage ,AllPackages,HomePackages , } from '../controllers/packageController.js';
import { togglePackageStatus } from '../controllers/packageController.js';
import { getPackageMembersCount } from '../controllers/packageController.js';
import { authorizeAgent,authMiddleware} from '../middleware/authMiddleware.js'



const router = express.Router();



//all packages 
router.get('/allpackages', AllPackages);


//homePackages
router.get('/homepackages', HomePackages);


//create package 
router.post('/createPackage',authMiddleware,  createPackage);


//get all package for agent without filter
// router.get('/getAll', getAllPackages);


//get package with id
// router.get('/:id', getPackageById);


//update package for agent
router.post('/:id', updatePackage);

//delete package for agent
router.delete('/:id', deletePackage);



//toogle api(for package status)
router.patch('/:id/status', togglePackageStatus);


//to get all package members count
router.get('/:id/members', getPackageMembersCount);


// router.post('/comparePackage' , comparePackage)

export default router;
