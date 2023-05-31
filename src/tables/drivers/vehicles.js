import { DataTypes } from "sequelize";

export const createVehicle =  (sequelize) => {
    const Vehicle = sequelize.define(
      "Vehicle",
      {
        vehicle_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
       
        number_of_seats: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        mispar_rishuy: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          build_date: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
            // waiting_time_rate: {
      //   type: DataTypes.DECIMAL(5, 2),
      //   allowNull: true,
      // },
      overtime_price:{ 
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      },
      {
        tableName: "vehicles",
        timestamps: false,
        schema: "extended_travel",
      }
    );
    
    // sequelize.sync({force:true});
    return Vehicle;
  };
  