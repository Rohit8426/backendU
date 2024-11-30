import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Package from './Package.js';

const Agent = sequelize.define('Agent', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    businessAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DOB: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    agencyLicenseNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issuingAuthority: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    servicesOffered: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reference1: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            name: null,
            phone: null,
            email: null,
            company: null
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Adjust based on whether every agent must have a userId
      },
}, {
    schema: 'umrahschema',
    tableName: 'agent',
    timestamps: true,
});



export default Agent;
