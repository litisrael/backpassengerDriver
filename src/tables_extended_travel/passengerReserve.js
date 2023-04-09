import { DataTypes } from "sequelize";


export const createPassengerReservation = async (sequelize) => {
const PassengerReservation = sequelize.define('reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number_of_passengers: {
      type: DataTypes.INTEGER
    },
    start_day: {
      type: DataTypes.DATEONLY
    },
    end_day: {
      type: DataTypes.DATEONLY
    },
    km_total: {
      type: DataTypes.DOUBLE
    }
  },  {
    tableName: "reservation",
    timestamps: false,
    schema: "extended_travel",
  });
  return PassengerReservation
}
  