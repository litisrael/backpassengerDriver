import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from "sequelize";


// POSTGRES_URL="postgres://default:3giXyq9dpMVZ@ep-royal-flower-18061638-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb"
// POSTGRES_PRISMA_URL="postgres://default:3giXyq9dpMVZ@ep-royal-flower-18061638-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
// POSTGRES_URL_NON_POOLING="postgres://default:3giXyq9dpMVZ@ep-royal-flower-18061638.eu-central-1.postgres.vercel-storage.com:5432/verceldb"
// POSTGRES_USER="default"
// POSTGRES_HOST="ep-royal-flower-18061638-pooler.eu-central-1.postgres.vercel-storage.com"





export const getConnection = async () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  // database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'transport',
  quoteIdentifiers: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Puedes ajustar esto según tus necesidades de seguridad
    }
  }
  });

  return await sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
  return sequelize;
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
  throw err;
});
};















// export const getConnection = async () => {
//   const sequelize = new Sequelize({
//     dialect: process.env.db_dialect ,
//     host: process.env.db_localhost,
//     port: process.env.db_port,
//     database: "transoprt",
//     username: process.env.db_user,
//     password: process.env.db_password_local,
//     quoteIdentifiers: false
//   });

//   return await sequelize.authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
//   return sequelize;
// })
// .catch(err => {
//   console.error('Unable to connect to the database:', err);
//   throw err;
// });
// };







// import path from 'path';
// export const getConnection = async () => {
  
// const AWS_CREDENTIALS_PATH = 'C:/Users/isroe/.aws';
// const credentials = fs.readFileSync(path.resolve(AWS_CREDENTIALS_PATH, 'credentials'));

//   const [, , , , , password] = credentials.toString().split('\n');

//   const sequelize = new Sequelize({
//     dialect: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     database: 'transportation',
//     username: 'postgres',
//     password: password.trim(),
//   });

//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     return sequelize;
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     throw error;
//   }
// };

