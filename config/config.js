

console.log("Sequelize config loaded");
export default {
development : {
  username: 'postgres',
  password: '842611',
  database: 'umrah',
  host: '127.0.0.1',
  dialect: 'postgres'
},
 test : {
  username: 'postgres',
  password: '842611',
  database: 'umrah',
  host: '127.0.0.1',
  dialect: 'postgres'
},
production: {
  DATABASE_URL: process.env.DATABASE_URL,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Disable logging in production
  schema: 'umrahschema', // Specify your schema
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
},
//  production : {
//   username: 'postgres',
//   password: '12345',
//   database: 'UMRAH',
//   host: '127.0.0.1',
//   dialect: 'postgres'
// }
}



// };