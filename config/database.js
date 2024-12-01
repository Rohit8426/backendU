import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',  
  password: process.env.DB_PASSWORD || '842611',  
  database: process.env.DB_NAME || 'umrah',
  database: process.env.DB_PORT,
  schema: 'umrahschema',
  logging: false,  
});


export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize };


export default sequelize;


