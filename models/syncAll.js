import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { pathToFileURL } from 'url';  
import sequelize from '../config/database.js'; 


const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);


const modelsPath = path.join(_dirname, '../models');

const models = {};


const loadModels = async () => {
  const files = fs.readdirSync(modelsPath); 

  
  const modelImports = files
    .filter(file => file.endsWith('.js'))  
    .map(async (file) => {
      const modelPath = path.join(modelsPath, file); 
      const modelUrl = pathToFileURL(modelPath).href;  
      
      const model = (await import(modelUrl)).default;  
      const modelName = file.split('.')[0];  
      models[modelName] = model;  
    });
  await Promise.all(modelImports);
};


// Define relationships after loading models
const defineRelationships = () => {
  const { Package, Stay, Price, Itinerary, AdditionalFee } = models;

  // Define relationships between models
  Package.hasMany(Stay, { foreignKey: 'packageId' });
  Stay.belongsTo(Package, { foreignKey: 'packageId' });

  Package.hasMany(Price, { foreignKey: 'packageId' });
  Price.belongsTo(Package, { foreignKey: 'packageId' });

  Package.hasMany(Itinerary, { foreignKey: 'packageId' });
  Itinerary.belongsTo(Package, { foreignKey: 'packageId' });

  Package.hasMany(AdditionalFee, { foreignKey: 'packageId' });
  AdditionalFee.belongsTo(Package, { foreignKey: 'packageId' });
};



const syncAll = async () => {
  try {
    await loadModels(); 
    await sequelize.sync({ force: false, alter: true });
    console.log('All models are synchronized successfully!');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

syncAll();

export default models;
