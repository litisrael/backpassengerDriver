import { DataTypes } from "sequelize";

export const createVehicle = async (sequelize) => {
    const Vehicle =await sequelize.define(
      "Vehicle",
      {
        vehicle_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
     
        },
       
        number_of_seats: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate : {max: 65, min: 7, }
        },
        // mispar_rishion: {
        //   type: DataTypes.INTEGER,
        //   allowNull: true,
        //   validate:{ len: [2,6]}
        // },
        mispar_rishuy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate:{ len: [2,6]}
          },
          build_date: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate:{ len: [2,6]}
          },
            // waiting_time_rate: {
      //   type: DataTypes.DECIMAL(5, 2),
      //   allowNull: true,
      // },
      overtime_price:{ 
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      shomer_shabat: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_available_work_multiple_days: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      },
      {
        tableName: "vehicles",
        timestamps: false,
        schema: "extended_travel",
      }
    );
    
    return Vehicle;
  };
  