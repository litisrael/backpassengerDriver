import { DataTypes } from "sequelize";
import {
  regionEnum,
  dayOfWeekEnum,
  getDayOfWeekInEnglish,
} from "../utility.js";

export const createReservationTwoWays = (sequelize) => {
  const ReservationTwoWays = sequelize.define(
    "ReservationTwoWays",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      number_of_passengers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      from_region: {
        type: DataTypes.ENUM(...regionEnum()),
        allowNull: false,
      },
      from_street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      to_city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      to_street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      day_week: {
        type: DataTypes.ENUM(...dayOfWeekEnum()),
      },
      departure_hour: {
        type: DataTypes.TIME,
      },

      waiting_hours: {
        type: DataTypes.TIME,
      },
    },
    {
      tableName: "reservation_two_ways",
      timestamps: true,
      schema: "extended_travel",
    }
  );


  ReservationTwoWays.beforeCreate(async (model) => {
    const dayOfWeekInEnglish =  getDayOfWeekInEnglish(model.date);
    console.log(dayOfWeekInEnglish);
    model.day_week = dayOfWeekInEnglish;
  });

  ReservationTwoWays.beforeUpdate(async (model) => {
    const dayOfWeekInEnglish = await getDayOfWeekInEnglish(model.date);
    model.day_week = dayOfWeekInEnglish;
  });
  return ReservationTwoWays;
};