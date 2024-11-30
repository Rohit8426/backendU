import { Model, where } from 'sequelize';
import Package from '../models/Package.js';
import Agent from '../models/agent.js';
import User from '../models/user.js';

export const userAllPackages = async (req, res) => {
  try {
    const { packageType } = req.query;
    const filters = {};
    if (packageType) filters.packageType = packageType;

    const packages = await Package.findAll({
      where: filters,
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getPackageDetails = async (req, res) => {
  try {
    const { packageId } = req.params; 

    
    const packageDetail = await Package.findOne({
      where: { id: packageId },
      include: [
        {
          model: Agent,
          as: 'agent', 
          attributes: ['id', 'fullName', 'email', 'companyName', 'phone'], 
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'], 
      },
    });

    if (!packageDetail) {
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log(packageDetail);
    

    res.status(200).json({
      message: 'Package retrieved successfully',
      package: packageDetail,
    });
  } catch (error) {
    console.error('Error retrieving package details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};