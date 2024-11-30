import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Packages', 
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', 
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   transactionId: {
    type: DataTypes.STRING,
    allowNull: true, // Make it optional if needed
  },
  roomType: {
    type: DataTypes.ENUM("Single", "Double", "Suite"),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 15], 
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DOB:{
type:DataTypes.DATEONLY,
allowNull: false
  },
  gender:{
    type:DataTypes.ENUM('Male','Female'),
    allowNull: false
  }, 
  approved: {
    type:DataTypes.BOOLEAN,
    defaultValue: false, // Set default value as false
  },
}, {
  schema: 'umrahschema',
  tableName: 'Bookings', 
  timestamps: true,      
});

export default Booking;


