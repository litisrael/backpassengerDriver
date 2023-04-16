import { getConnection } from "../database/connection.js";
import * as Tables from "./createTables.js";


export async function initDB() {
  const sequelize = await getConnection();
  const tables = await Tables.createTables(sequelize);
   sequelize.sync();

  return tables;
}
