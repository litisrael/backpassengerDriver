import { DataTypes } from "sequelize";

export const createPassenger =  (sequelize) => {
const Passenger = sequelize.define('Passenger', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    passenger_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
   passenger_mail: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    passenger_cell: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
    
  },  {
    tableName: "passenger",
    timestamps: false,
    schema: "extended_travel",
  },)
  // sequelize.sync({force:true});
  // console.log("---------------",Passenger,"---------------")
  return Passenger
}