import Booking from "../models/Booking .js";
import Package from "../models/Package.js";
import User from "../models/user.js";
import Agent from "../models/agent.js";
import Group from "../models/group.js";
import GroupUser from "../models/GroupUser.js";
import Notification from "../models/Notification .js";

 export  const getAgentBookings = async (req, res) => {
    try {
      const { filterDate } = req.query; 
  
      const filters = {};
      if (filterDate) {
        filters.status ="paid";
        filters.createdAt = filterDate; 
      }
  
      const bookings = await Booking.findAll({
        where: filters,
        include: [
          {
            model: Package,
            as: "package",
            attributes: ["id", "packageName", "packageType", "planType"], 
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "phone"], 
          },
          {
            model: Agent,
            as: "agent", 
            attributes: ["fullName"], 
          },
        ],
        attributes: [
          "id",
          "packageId",
          "userId",
          "transactionId",
          "roomType",
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "DOB",
          "gender",
          "createdAt",
          "updatedAt",
        ],
        order: [["createdAt", "DESC"]], 
      });

      const formattedBookings = bookings.map((booking) => ({
        bookingId: booking.id,
        name: `${booking.firstName} ${booking.lastName}`,
        contactDetails: {
          phone: booking.phone,
          email: booking.email,
        },
        address: booking.address,
        DOB: booking.DOB,
        gender: booking.gender,
        package: {
          id: booking.package?.id,
          name: booking.package?.packageName,
          type: booking.package?.packageType,
          plan: booking.package?.planType,
        },
        agent: {
          name: booking.agent?.fullName, 
        },
        user: {
          id: booking.user?.id,
          email: booking.user?.email,
          phone: booking.user?.phone,
        },
        transactionId: booking.transactionId,
        roomType: booking.roomType,
        date: booking.createdAt, 
        status: "Paid", 
        paidAmount: `4563 SR / Person`,
      }));
  
      res.status(200).json({
        message: "Bookings retrieved successfully",
        bookings: formattedBookings,
      });
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId; // Extract the authenticated user ID

    // Fetch the booking details
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Log the booking for debugging
    console.log('Booking found:', booking);

    // Check if the booking is already approved
    if (booking.approved) {
      return res.status(200).json({
        success: false,
        message: 'This booking is already approved.',
      });
    }

    // Approve the booking
    booking.approved = true;
    await booking.save();

    console.log('Booking approved successfully.');

    // Fetch agent and user details
    const agent = await Agent.findByPk(booking.agentId); // Use booking.agentId to get the agent
    const user = await User.findByPk(booking.userId); // Use booking.userId to get the user
    req.agent = agent
console.log(agent);
console.log(user);


    if (!agent || !user) {
      return res.status(404).json({
        success: false,
        message: 'User or agent details not found.',
      });
    }

    // Get the full name of the agent and user
    const agentName = agent.fullName || 'Agent Name Not Available'; // Assuming 'fullName' is present in agent
    const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
//take  only fullName from agentName object
const agentNameOnly = agentName.split(' ').slice(0, -1).join('');
console.log(agentNameOnly);
console.log(fullName);


    // Fetch the package details
    const packageDetails = await Package.findByPk(booking.packageId); // Fetch package details using packageId

    if (!packageDetails) {
      return res.status(404).json({
        success: false,
        message: 'Package details not found.',
      });
    }

    // Create notification messages
    const userMessage = `Your booking for package "${packageDetails.packageName}" has been approved by Agent ${agentName}.`;
    const agentMessage = `You have approved the booking for User ${fullName} for package "${packageDetails.packageName}".`;

    // Send notifications to the user and the agent
    await sendNotification(booking.userId, userMessage); // Notify the user
    await sendNotification(agent.id, agentMessage); // Notify the agent

    // Add user to the package group
    await addUserToPackageGroup(booking);

    return res.status(200).json({
      success: true,
      message: 'Booking approved and user added to the package group successfully.',
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while approving the booking.',
      error: error.message,
    });
  }
};

//helper function
const addUserToPackageGroup = async (booking) => {
  const { userId, packageId } = booking;

  try {
    // Fetch the package details to get the agentId
    const packageDetails = await Package.findByPk(packageId);
    if (!packageDetails) {
      throw new Error(`Package with ID ${packageId} not found.`);
    }

    const { agentId } = packageDetails;

    // Find or create the group for the given packageId and agentId
    const [group, created] = await Group.findOrCreate({
      where: { packageId, agentId },
    });

    if (created) {
      console.log(`New group created for package ${packageId} under agent ${agentId}`);
    } else {
      console.log(`Existing group found for package ${packageId} under agent ${agentId}`);
    }

    // Check if the user is already part of the group
    const userInGroup = await GroupUser.findOne({
      where: { groupId: group.id, userId },
    });

    if (!userInGroup) {
      // Add the user to the group
      await GroupUser.create({ groupId: group.id, userId });
      console.log(`User ${userId} added to group ${group.id} for package ${packageId}`);
    } else {
      console.log(`User ${userId} is already part of group ${group.id} for package ${packageId}`);
    }
  } catch (error) {
    console.error(`Error adding user ${userId} to package group ${packageId}:`, error);
    throw new Error('Failed to add user to the package group.');
  }
};


const sendNotification = async (userId, message) => {
  try {
    await Notification.create({ userId, message });
    console.log(`Notification sent to user ${userId}: ${message}`);
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
  }
};


export default approveBooking;

