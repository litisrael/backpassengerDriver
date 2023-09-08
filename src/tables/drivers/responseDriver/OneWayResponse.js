import { DataTypes } from "sequelize";

export const createResponseOneWay = async(sequelize) => {
  const responseOneWay = await sequelize.define(
    "responseOneWay",
    {
      resoponse_one_way_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
       
      },
      driver_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      
      },

   
 
    },
    {
      tableName: "responseOneWay",
      timestamps: false,
      schema: "extended_travel",
    }
  );

  return responseOneWay;
};
