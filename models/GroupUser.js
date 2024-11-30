import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GroupUser = sequelize.define('GroupUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Groups', key: 'id' },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'User', key: 'id' },
  },
}, {
  schema: 'umrahschema',
  tableName: 'GroupUsers',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['groupId', 'userId'], // Ensure a user can't be added to the same group twice
    },
  ],
});

export default GroupUser;
