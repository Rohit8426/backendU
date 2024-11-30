import Booking from '../models/Booking .js';
import Package from '../models/Package.js';


export const createBooking = async (req, res) => {
  try {
    // 1. Retrieve user ID from authenticated user (JWT token, for example)
    const userId = req.user.userId;
    console.log(userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated.',
      });
    }

    // 2. Extract packageId and personalInfo from the request body
    const { packageId, personalInfo } = req.body;

    // 3. Validate that both packageId and personalInfo are provided
    if (!packageId || !personalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Package ID and personal information are required.',
      });
    }

    // 4. Check if the package exists by its packageId
    const packageDetails = await Package.findByPk(packageId);  // Using the primary key (packageId) to find the package

    // 5. If the package does not exist, return a 404 error
    if (!packageDetails) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    // 6. Retrieve the associated agentId from the package
    const agentId = packageDetails.agentId;

    // 7. If no agentId is found in the package, return an error
    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'The package does not have an associated agent.',
      });
    }

    // 8. Extract and validate personal information (e.g., firstName, lastName, email, phone)
    const { firstName, lastName, email, phone, address, gender, DOB } = personalInfo;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and phone are required.',
      });
    }

    // 9. Create the booking record using the validated data
    const booking = await Booking.create({
      userId,
      packageId,
      agentId, // Include the extracted agentId in the booking
      firstName,
      lastName,
      email,
      phone,
      address: address || '',  // Default empty string if no address is provided
      gender: gender || '',  // Default empty string if no gender is provided
      DOB: DOB ? new Date(DOB) : null,  // If DOB is provided, format it as a Date object
    });

    // 10. Return a success response with the created booking ID
    return res.status(201).json({
      success: true,
      message: 'Booking details saved successfully.',
      data: { bookingId: booking.id },  // Return the booking ID in the response
    });
  } catch (error) {
    // 11. Catch any errors and send an error response
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking.',
      error: error.message,
    });
  }
};
