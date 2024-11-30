import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';  

const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  }, 
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10, 15],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'agent','admin'), 
    allowNull: false,
  }
},{
  schema: 'umrahschema', 
  tableName: 'User',
  timestamps: true,
});

export default User;
