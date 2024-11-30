
import Package from '../models/Package.js';
// import Agent from '../models/agent.js';

const comparePackage = async (req, res) => {
  
    try {
      const { packageIds } = req.body;
  console.log("server started");
  
      console.log("Package IDs from request:", packageIds);
  
      if (!packageIds || !Array.isArray(packageIds) || packageIds.length < 2) {
        return res.status(400).json({ message: 'Please provide at least two package IDs for comparison.' });
      }
  
      // Fetch packages
      const packages = await Package.findAll({
        where: {
          id: packageIds
        },
        attributes: [
          'id', 'packageName', 'packageType', 'planType', 'startDate', 'endDate',
          'departureFlight', 'returnFlight', 'visaAssistance', 'description',
          'minMembers', 'maxMembers', 'roomType', 'amount', 'location',
          'nights', 'durationDays', 'activities', 'hotelDetails', 'feeType', 'status'
        ]
      });
  
      console.log("Packages fetched from DB:", packages);
  
      if (packages.length < 2) {
        return res.status(404).json({ message: 'One or more package IDs were not found.' });
      }
  
      // Structure the response for comparison
      const comparisonResult = packages.map(pkg => ({
        id: pkg.id,
        packageName: pkg.packageName,
        packageType: pkg.packageType,
        planType: pkg.planType,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        departureFlight: pkg.departureFlight,
        returnFlight: pkg.returnFlight,
        visaAssistance: pkg.visaAssistance,
        minMembers: pkg.minMembers,
        maxMembers: pkg.maxMembers,
        roomType: pkg.roomType,
        amount: pkg.amount,
        location: pkg.location,
        nights: pkg.nights,
        durationDays: pkg.durationDays,
        activities: pkg.activities,
        hotelDetails: pkg.hotelDetails,
        feeType: pkg.feeType,
        status: pkg.status
      }));
  
      res.status(200).json({ message: 'Comparison Successful', data: (comparisonResult) });
    } catch (error) {
      console.error('Error comparing packages:', error);
      res.status(500).json({ message: 'An error occurred while comparing packages.', error: error.message });
    }
  };

  export default comparePackage;