import Agent from '../models/agent.js';

export  const createAgent = async (req, res) => {
  const userId = req.user.userId;
  // console.log(userId);
  
  try {
    const {
      fullName, companyName, description, jobTitle, email, phone, state, zipCode, 
      businessAddress, DOB, gender, website, agencyLicenseNumber, issuingAuthority, 
      expiryDate, servicesOffered, reference1
    } = req.body;


    if (!companyName) {
      
    }

    // Create a new record in the database
    const newAgent = await Agent.create({
      fullName,
      companyName,
      description,
      jobTitle,
      email,
      phone,
      state,
      zipCode,
      businessAddress,
      DOB,
      gender,
      website,
      agencyLicenseNumber,
      issuingAuthority,
      expiryDate,
      servicesOffered,
      reference1,
      userId
    });

    res.status(201).json({
      message: 'Agent personal information created successfully',
      data: newAgent
    });
  } catch (error) {
    console.error('Error creating agent personal information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the authenticated user

    // Destructure the fields from the request body
    const {
      fullName, companyName, description, jobTitle, email, phone, state, zipCode,
      businessAddress, DOB, gender, website, agencyLicenseNumber, issuingAuthority,
      expiryDate, servicesOffered, reference1
    } = req.body;

    // Find the agent using the userId from the decoded JWT
    const agent = await Agent.findOne({ where: { userId } });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found for this user.' });
    }

    // Update the agent information with the new values
    await agent.update({
      fullName,
      companyName,
      description,
      jobTitle,
      email,
      phone,
      state,
      zipCode,
      businessAddress,
      DOB,
      gender,
      website,
      agencyLicenseNumber,
      issuingAuthority,
      expiryDate,
      servicesOffered,
      reference1
    });

    // Send response back with the updated agent data
    res.status(200).json({
      message: 'Agent personal information updated successfully',
      data: agent
    });
  } catch (error) {
    console.error('Error updating agent personal information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



