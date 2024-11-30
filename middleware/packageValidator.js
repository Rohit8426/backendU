import { body } from 'express-validator';

export const validatePackage = [
  body('packageName').isString().withMessage('Package name must be a string').notEmpty().withMessage('Package name is required'),
  body('packageType').isIn(['umrah', 'hajj']).withMessage('Package type must be "umrah" or "hajj"'),
  body('planType').isIn(['fixed plan', 'flexible plan']).withMessage('Plan type must be "fixed plan" or "flexible plan"'),
  body('startDate').isDate().withMessage('Start date must be a valid date'),
  body('endDate').isDate().withMessage('End date must be a valid date').custom((endDate, { req }) => {
    if (new Date(endDate) <= new Date(req.body.startDate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
  body('departureFlight').isString().withMessage('Departure flight must be a string').notEmpty().withMessage('Departure flight is required'),
  body('returnFlight').isString().withMessage('Return flight must be a string').notEmpty().withMessage('Return flight is required'),
  body('minMembers').isInt({ min: 1 }).withMessage('Minimum members must be at least 1'),
  body('maxMembers').isInt({ min: 1 }).withMessage('Maximum members must be greater than minimum members').custom((maxMembers, { req }) => {
    if (maxMembers <= req.body.minMembers) {
      throw new Error('Maximum members must be greater than minimum members');
    }
    return true;
  }),
  body('roomType').isIn(['double', 'triple', 'quad']).withMessage('Room type must be "double", "triple", or "quad"'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('location').isString().withMessage('Location must be a string').notEmpty().withMessage('Location is required'),
  body('nights').isInt({ min: 1 }).withMessage('Nights must be a positive integer'),
  body('durationDays').isInt({ min: 1 }).withMessage('Duration days must be a positive integer'),
  body('feeType').isIn(['perRoom', 'perMember']).withMessage('Fee type must be "perRoom" or "perMember"')
];
