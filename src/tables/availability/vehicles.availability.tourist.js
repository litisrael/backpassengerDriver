import { DataTypes } from "sequelize";

import {
  validateABeforeB,
  nextYear,
  currentDate,
  validateAfterCurrentDate,
} from "../utility.js";
import { validateDateNotBetweenExisting } from "../query/available_drivers.js";


export async  function createVehicleAvailabilityTourist(sequelize) {
  const VehicleAvailability = await sequelize.define(
    "VehicleAvailability",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      disable_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: { isAfter: currentDate },
      },
      disable_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: { isBefore: nextYear },
      },
    },
    {
      tableName: "vehicle_availability_tourist",
      timestamps: false,
      schema: "extended_travel",
    }
  );
  // beforeBulkCreate / beforeBulkUpdate
  // VehicleAvailability.beforeBulkCreate(async (models) => {
  //   for (const model of models) {
      
  //     validateABeforeB(model.disable_from, model.available_to);
  //     await validateDateNotBetweenExisting(
  //       model,
  //       model.disable_from,
  //       model.disable_until
  //     )
     
  //   }
  // });
  VehicleAvailability.beforeBulkUpdate(async(models) => {
    for (const model of models) {
    validateAfterCurrentDate(model.disable_from);
    validateABeforeB(model.disable_from, model.disable_until );
    await validateDateNotBetweenExisting(
      model,
      model.disable_from,
      model.disable_until
    );
    }
  });
  //  driverAvailability.sync({ force: true });

  return VehicleAvailability;
}
