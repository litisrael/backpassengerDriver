import { DataTypes } from "sequelize";
import {
  regionEnum,
  dayOfWeekEnum,
  getDayOfWeekInEnglish,
} from "../utility.js";
import { queryAvailableDriversForTrip } from "../query/oneway.js";

export let DriversForOneWay;


export const  createReservationOneWay = async (sequelize)  => {
  const ReservationOneWay = await sequelize.define(
    "ReservationOneWay",
    {
      id_one_way: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    
      },
      number_of_passengers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          checkPassengerRange(value) {
            if (value !== null && (value < 15 || value > 65)) {
              throw new Error('Number of passengers must be between 15 and 65.');
            }
          }
        }
      },

      from_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      to_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coordinates_origin: {
        type: DataTypes.GEOGRAPHY("POINT"), // Aquí utilizamos el tipo Geography y especificamos POINT para coordenadas de un solo punto
        allowNull: true, // Si las coordenadas pueden ser nulas, establece esta opción a true
      },

      coordinates_destine: {
        type: DataTypes.GEOGRAPHY("POINT"),
        allowNull: true,
      },

      departure_date: {
        type: DataTypes.DATEONLY,
        // allowNull: true,
      },
      day_week: {
        type: DataTypes.ENUM(...dayOfWeekEnum()),
      },

      departure_hour: {
        type: DataTypes.TIME,
      },
    },
    {
      tableName: "reservation_oneway",
      timestamps: false,
      schema: "extended_travel",
    }
  );
  ReservationOneWay.beforeCreate(async (model) => {
    const dayOfWeekInEnglish = getDayOfWeekInEnglish(model.departure_date);
    // console.log(dayOfWeekInEnglish);
    model.day_week = dayOfWeekInEnglish;
  });

  ReservationOneWay.beforeUpdate(async (model) => {
    const dayOfWeekInEnglish = await getDayOfWeekInEnglish(
      model.departure_date
    );
    model.day_week = dayOfWeekInEnglish;
  });

  ReservationOneWay.afterCreate(async(model) => {
    DriversForOneWay =await queryAvailableDriversForTrip(
      sequelize,
      model.day_week,
      model.id_one_way
    );
  });

  ReservationOneWay.afterUpdate((model) => {
    DriversForOneWay = queryAvailableDriversForTrip(
      sequelize,
      model.day_week,
      model.coordinates_origin,
      model.id_one_way
      
    );
  });

  return ReservationOneWay;
};
