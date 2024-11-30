import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import AgentPersonalInfo from './agent.js';

const Package = sequelize.define('Package', {
  packageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  packageType: {
    type: DataTypes.ENUM('umrah', 'hajj'),
    allowNull: false,
  },
  planType:{
   type:DataTypes.ENUM('fixed plan' ,'flexible plan')
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  departureFlight:{
    type:DataTypes.STRING,
    allowNull:false
  },
  returnFlight:{
    type:DataTypes.STRING,
    allowNull:false
  },
  visaAssistance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  minMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isGreaterThanMin(value) {
        if (value <= this.minMembers) {
          throw new Error('maxMembers should be greater than minMembers');
        }
      }
    }
  },
  roomType: {
    type: DataTypes.ENUM('double', 'triple', 'quad'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  additionalMeals:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nights: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // This can be auto-calculated by subtracting startDate from endDate
  },
  activities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hotelDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  feeType: {
    type: DataTypes.ENUM('perRoom', 'perMember'),
    allowNull: false,
  },
  status:{
    type: DataTypes.ENUM('active', 'inactive' ,'completed'),
    allowNull: true,
    defaultValue: 'inactive',
    },
    image:{
    type:DataTypes.STRING,
    allowNull:true
    },
    itinerary: {
      type: DataTypes.JSON, 
      allowNull: true,     
    },

}, {
  schema: 'umrahschema',
  tableName: 'Packages',
  timestamps: true,
});





Package.addHook('beforeCreate', async (Package, options) => {
  if (!Package.agentId) {
    const defaultAgent = await AgentPersonalInfo.findOne({ where: { id: 1 } });
    if (defaultAgent) {
      Package.agentId = defaultAgent.id;
    }
  }
});

export default Package;




