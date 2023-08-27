import * as pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from "sequelize";

// esto es postgres de vercel
// https://backpassenger-driver.vercel.app/



// export const getConnection = async () => {
//   const sequelize = new Sequelize({
//     dialect: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   // database: process.env.POSTGRES_DATABASE,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: 'transport',
//   quoteIdentifiers: false,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // Puedes ajustar esto según tus necesidades de seguridad
//     }
//   }
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













// local

export const getConnection = async () => {
  const sequelize = new Sequelize({
    dialect: process.env.db_dialect ,
    host: process.env.db_localhost,
    port: process.env.db_port,
    database: "transoprt",
    username: process.env.db_user,
    password: process.env.db_password_local,
    quoteIdentifiers: false
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



