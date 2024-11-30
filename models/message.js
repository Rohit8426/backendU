// models/Message.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false, // User or Agent ID
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if it's a group message
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Group ID for the chat
      references: {
        model: 'Groups',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // Message content (text)
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'file', 'video'), // Message type
      defaultValue: 'text',
    },
    attachments: {
      type: DataTypes.STRING, // Path or URL to attachment
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN, // Whether the message has been read
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: 'umrahschema',
    tableName: 'Messages',
    timestamps: false,
  }
);

export default Message;
