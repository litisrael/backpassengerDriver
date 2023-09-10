import { DataTypes } from "sequelize";

export const createResponseTwoWays =async (sequelize) => {
  const responseTwoWays = await sequelize.define(
    "responseTwoWays",
    {
      resoponse_two_ways_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
       
      },
   
      company_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        // validate: { is: /^[a-zA-Z0-9\s]+$/ }, no acepta hebreo
      },
      driver_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      
      },

   
 
    },
    {
      tableName: "responseTwoWays",
      timestamps: false,
      schema: "extended_travel",
    }
  );

  return responseTwoWays;
};
