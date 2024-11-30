import { Op } from 'sequelize';
import Package from '../models/Package.js';

export const getPreviousPackage = async (req, res) => {
  try {
    const previousTours = await Package.findAll({
      where: { status:  {
        [Op.or]: ['completed', 'active'], 
      } }, 
      order: [['endDate', 'DESC']], 
    });

    if (!previousTours) {
      res.status(404).json({message: 'package not found'})
    }
    res.status(200).json(previousTours);
  } catch (error) {
    console.error('Error fetching previous tours:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
