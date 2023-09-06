import { DataTypes } from "sequelize";
import { validateHourBeforeHour, validateABeforeB } from "../utility.js";

export const createDaysOfWeek = async (sequelize) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const tablesDays = daysOfWeek.map(dayOfWeek => {
    const table = sequelize.define(dayOfWeek, {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      unavailable_starting: {
        type: DataTypes.TIME,
        // defaultValue: '00:00'
      },
      unavailable_until: {
        type: DataTypes.TIME,
        // defaultValue: '00:01'
      }
    }, {
      tableName: dayOfWeek,
      timestamps: false,
      schema: "extended_travel"
    });

    table.beforeBulkCreate(async (models) => {
      for (const model of models) {
        if (model.unavailable_starting && model.unavailable_until) {
          validateHourBeforeHour(model.unavailable_starting, model.unavailable_until);
        }
      }
    });

    table.beforeBulkUpdate(async (model) => {
      // for (const model of models) {
        if (model.unavailable_starting && model.unavailable_until) {
          validateHourBeforeHour(model.unavailable_starting, model.unavailable_until);
        }
      // }
    });

    return table;
  });

  return tablesDays;
}
