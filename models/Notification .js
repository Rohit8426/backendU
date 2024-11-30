import { DataTypes ,Sequelize } from 'sequelize';
import sequelize from "../config/database.js";
const Notification = sequelize.define('Notification', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },{
    schema: 'umrahschema',
    tableName: 'Notification',
    timestamps: false,
  });

  export default Notification;
  