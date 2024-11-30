import Package from '../models/Package.js';
import Agent from '../models/agent.js';


export const AllPackages = async (req, res) => {
  try {
    const { status, packageType, planType, search, sort } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (packageType) filters.packageType = packageType;
    if (planType) filters.planType = planType;
    if (search) {
      filters.packageName = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    const sortOption = sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']];

    const packages = await Package.findAll({
      where: filters,
      order: sortOption,
    });

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const assignPackageImage = (packageType) => {
  let imagePath = '';

  if (packageType === 'hajj') {
    imagePath = '/assets/package-2.png'; 
  } else if (packageType === 'umrah') {
    imagePath = '/assets/package-3.png'; 
  }

  return imagePath;
};

export const createPackage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Check for user role
    if (role !== 'agent') {
      return res.status(403).json({
        message: 'Access denied. Only agents are allowed to create packages.',
      });
    }

    // Validate agent existence
    const agent = await Agent.findOne({ where: { userId } });
    if (!agent) {
      return res.status(404).json({
        message: 'Agent not found for this user.',
      });
    }

    // Destructure and validate input
    const { packageType, status = 'inactive', ...packageDetails } = req.body;

    if (!packageType) {
      return res.status(400).json({
        success: false,
        message: 'packageType is required.',
      });
    }

    // Assign image based on packageType
    const image = assignPackageImage(packageType);

    const packageData = await Package.create({
      ...packageDetails,
      userId,
      agentId: agent.id,
      packageType, // Ensure it's passed explicitly
      status,
      image,
    });

    console.log('Package created successfully:', packageData);

    res.status(201).json({
      success: true,
      message: 'Package created successfully.',
      package: packageData,
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating package.',
      error: error.message,
    });
  }
};





export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving packages', error });
  }
};


// Get a specific package by ID
export const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findByPk(req.params.id);
    if (!packageData) return res.status(404).json({ message: 'Package not found' });
    res.status(200).json(packageData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving package', error });
  }
};

// Update a package by ID
export const updatePackage = [
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    try {
      const updated = await Package.update(req.body, { where: { id: req.params.id } });
      if (!updated[0]) return res.status(404).json({ message: 'Package not found' });
      res.status(200).json({ message: 'Package updated successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error updating package', error });
    }
  }
];

// Delete a package by ID
export const deletePackage = async (req, res) => {
  try {
    const deleted = await Package.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Package not found' });
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error });
  }
};



//toggle 
export const togglePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "active" or "inactive".' });
    }

    // Find and update package status
    const packageData = await Package.findByPk(id);
    if (!packageData) return res.status(404).json({ message: 'Package not found' });

    packageData.status = status;
    await packageData.save();

    res.status(200).json({ message: `Package status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating package status', error });
  }
};




//members count on that package
export const getPackageMembersCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageData = await Package.findByPk(id, {
      attributes:  ['maxMembers']
    });
    
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({
      maxMembers: packageData.maxMembers,
    });
  } catch (error) {
    console.error('Error fetching package members count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



//homePackage for show in homepage
export const HomePackages = async (req, res) => {
  try {
    const { packageType } = req.query;
    const filters = {};
    if (packageType) filters.packageType = packageType;

    
    const fetchedPackages = await Package.findAll({
      where: filters,
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // Store the result in a variable
    const packages = fetchedPackages.map(pkg => ({
      id: pkg.id,
      packageName: pkg.packageName,
      packageType: pkg.packageType,
      price: pkg.price,
      durationDays: pkg.durationDays,
      nights:pkg.nights,
      hotelDetails:pkg.hotelDetails,
      additionalMeals:pkg.additionalMeals,
      createdAt: pkg.createdAt,
      feeType:pkg.feeType,
      visaAssistance:pkg.visaAssistance,
      image:pkg.image
    }));

    res.status(200).json({
      data:packages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



//compare package for show in compare page
// export const comparePackage =async (req, res) => {
//   try {
//       const { packageIds } = req.body;

//       console.log(packageIds);
      
//       if (!packageIds || !Array.isArray(packageIds) || packageIds.length < 2) {
//           return res.status(400).json({ message: 'Please provide at least two package IDs for comparison.' });
//       }


//       console.log("Package IDs from request:", packageIds);

//       // Fetch packages
//       const packages = await Package.findAll({
        
//           where: {
//               id: packageIds
//           },
//           attributes: [
//               'id', 'packageName', 'packageType', 'planType', 'startDate', 'endDate', 
//               'departureFlight', 'returnFlight', 'visaAssistance', 'description',
//               'minMembers', 'maxMembers', 'roomType', 'amount', 'location',
//               'nights', 'durationDays', 'activities', 'hotelDetails', 'feeType', 'status'
//           ]
//       });

//       console.log("i got packages");
      

//       if (packages.length < 2) {
//           return res.status(404).json({ message: 'One or more package IDs were not found.' });
//       }

//       // Structure the response for comparison
//       const comparisonResult = packages.map(pkg => ({
//           id: pkg.id,
//           packageName: pkg.packageName,
//           packageType: pkg.packageType,
//           planType: pkg.planType,
//           startDate: pkg.startDate,
//           endDate: pkg.endDate,
//           departureFlight: pkg.departureFlight,
//           returnFlight: pkg.returnFlight,
//           visaAssistance: pkg.visaAssistance,
//           minMembers: pkg.minMembers,
//           maxMembers: pkg.maxMembers,
//           roomType: pkg.roomType,
//           amount: pkg.amount,
//           location: pkg.location,
//           nights: pkg.nights,
//           durationDays: pkg.durationDays,
//           activities: pkg.activities,
//           hotelDetails: pkg.hotelDetails,
//           feeType: pkg.feeType,
//           status: pkg.status
//       }));

//       res.status(200).json({ message: 'Comparison Successful', data: comparisonResult });
//   } catch (error) {
//       console.error('Error comparing packages:', error);
//       res.status(500).json({ message: 'An error occurred while comparing packages.', error: error.message });
//   }
// }
