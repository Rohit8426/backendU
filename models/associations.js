import Agent from './agent.js';
import Package from './Package.js';
import User from './user.js';
import Booking from './Booking .js';
import Group from './group.js';
import Message from './message.js';
import GroupUser from './GroupUser.js';


const setupAssociations = () => {

Package.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent',});
  

Agent.hasMany(Package, {foreignKey: 'agentId',as: 'packages',});

Package.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
User.hasMany(Package, { foreignKey: 'userId', as: 'createdPackages' });

User.hasOne(Agent, { foreignKey: 'userId', as: 'agentInfo' });
Agent.belongsTo(User, { foreignKey: 'userId', as: 'user' });


User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Package.hasMany(Booking, { foreignKey: 'packageId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });


Booking.belongsTo(Agent, {foreignKey: "agentId",as: "agent",});


Agent.hasMany(Booking, {foreignKey: "agentId",as: "bookings",});


User.belongsToMany(Package, { through: Group, foreignKey: 'userId' });
Package.belongsToMany(User, { through: Group, foreignKey: 'packageId' });


// A group can have many messages
Group.hasMany(Message, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

// A user can send many messages
User.hasMany(Message, { foreignKey: 'senderId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId' });

// A user can receive many messages
User.hasMany(Message, { foreignKey: 'receiverId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'receiverId' });



Group.hasMany(GroupUser, { foreignKey: 'groupId', onDelete: 'CASCADE' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId' });


User.hasMany(GroupUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
GroupUser.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(GroupUser, { foreignKey: 'groupId' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId' });
GroupUser.belongsTo(User, { foreignKey: 'userId' });
Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

  
};
export default setupAssociations;
