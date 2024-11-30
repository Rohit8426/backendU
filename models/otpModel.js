// models/Otp.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Otp = sequelize.define('Otp', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'umrahschema', 
  tableName: 'OTP',  
  timestamps: false,  
});

export default Otp;
