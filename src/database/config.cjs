import { config } from "./babelHook.js";

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.db_user,
    password: process.env.db_password_local,
    database: "transoprt",
    host: process.env.db_localhost,
    dialect: process.env.db_dialect,
  },
  test: {
    username: process.env.db_user,
    password: process.env.db_password_local,
    database: "transoprt",
    host: process.env.db_localhost,
    dialect: process.env.db_dialect,
  },
  production: {
    username: process.env.db_user,
    password: process.env.db_password_local,
    database: "transoprt",
    host: process.env.db_localhost,
    dialect: process.env.db_dialect,
  },
};
