import { DataTypes } from "sequelize";
import { regionEnum } from "../utility.js";
import { createVehicleAvailabilityTourist } from "../availability/vehicles.availability.tourist.js";

export const createCompany = async (sequelize) => {
  const Company = await sequelize.define(
    "Company",
    {
      company_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
       
      },
      auth_id: {
        type: DataTypes.STRING(80), // Puedes ajustar el tipo de dato según el ID único de Auth0
        allowNull: false,
        // unique: true,
      },
      company_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        // validate: { is: /^[a-zA-Z0-9\s]+$/ }, no acepta hebreo
      },
      company_mail: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      company_cell: {
        type: DataTypes.STRING(20),
        allowNull: false,
        // unique: true,
        // validate: { isNumeric: true, len: [2, 10] },
      },

      address_company: {
        type: DataTypes.STRING(80),
        allowNull: true, // Si las coordenadas pueden ser nulas, establece esta opción a true
      },

      work_zone: {
        type: DataTypes.GEOGRAPHY("POINT"),
        allowNull: true, // Si las coordenadas pueden ser nulas, establece esta opción a true
      },
      radius: {
        type: DataTypes.DOUBLE, // Podemos usar DOUBLE o FLOAT para almacenar el radio en kilómetros
        allowNull: true,
      },
 
    },
    {
      tableName: "company",
      timestamps: false,
      schema: "extended_travel",
    }
  );

  //  sequelize.sync({alter:true})
  return Company;
};
