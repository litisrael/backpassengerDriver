import { DataTypes } from "sequelize";

export const createPassenger =  (sequelize) => {
const Passenger = sequelize.define('Passenger', {
    id: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    auth_id: {
      type: DataTypes.STRING(80), // Puedes ajustar el tipo de dato según el ID único de Auth0
      allowNull: false,
      unique: true,
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
      allowNull: false,
      // validate: {
      //   len: {
      //     args: [4, 12], // Allowed length range (minimum, maximum)
      //     msg: 'The number must have exactly 10 digits.' // Custom error message
      //   }
      // }
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