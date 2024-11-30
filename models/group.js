import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  schema: 'umrahschema',
  tableName: 'Groups',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['packageId', 'agentId'], 
    },
  ],
});

export default Group;
