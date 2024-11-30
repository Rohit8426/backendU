// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';  

const ForgetPass = sequelize.define('ForgetPass', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  schema: 'umrahschema', 
  tableName: 'ForgetPass',
  timestamps: true, 
});

export default ForgetPass;
