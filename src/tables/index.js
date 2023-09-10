import { getConnection } from "../database/conecction.js";
import { createPassenger } from "./passengers/passenger.js";
import { createReservationTourist } from "./passengers/reserve.tourist.js";
import { createCompany } from "./drivers/company.js";
import { createVehicleAvailabilityTourist } from "./availability/vehicles.availability.tourist.js";
import { createVehicle } from "./drivers/vehicles.js";
import { createReservationOneWay } from "./passengers/reserve.one.way.js";
// import { queryDriversOfReserve } from "../api/query/reserve.drivers.js";
import { createDaysOfWeek } from "./availability/days.of.week.js";
import { createReservationTwoWays } from "./passengers/reserve.two.ways.js";
import { createResponseOneWay } from "./drivers/responseDriver/OneWayResponse.js";
import { createResponseTwoWays } from "./drivers/responseDriver/twoWaysresopose.js";

async function tablesDrivers(sequelize) {
  const daysOfWeek = await createDaysOfWeek(sequelize);
  const company = await createCompany(sequelize);
  const vehiclesAvailabilityTourist = await createVehicleAvailabilityTourist(sequelize);
  const vehicle = await createVehicle(sequelize);

  await company.hasMany(vehicle, {
    foreignKey: {
      name: "company_id",
      allowNull: false,
    },
  });

  await vehicle.belongsTo(company, {
    foreignKey: {
      name: "company_id",
      allowNull: false,
    },
  });

  await vehicle.hasMany(vehiclesAvailabilityTourist, {
    foreignKey: {
      name: "vehicle_id",
      allowNull: false,
    },
  });

  await vehiclesAvailabilityTourist.belongsTo(vehicle, {
    foreignKey: {
      name: "vehicle_id",
      allowNull: false,
    },
  });

  for (const dayOfWeek in daysOfWeek) {
   await vehicle.hasMany(daysOfWeek[dayOfWeek], {
      foreignKey: {
        name: "vehicle_id",
        allowNull: false,
      },
    });

    await  daysOfWeek[dayOfWeek].belongsTo(vehicle, {
      foreignKey: {
        name: "vehicle_id",
        allowNull: false,
      },
    });
  }

  return {
    vehiclesAvailabilityTourist,
    company,
    vehicle,
    daysOfWeek,
  };
}




async function tablesPassenger(sequelize) {
  const passenger = await createPassenger(sequelize);
  const passengerReservationTourist = await createReservationTourist(sequelize);
  const passengerReservationOneWay = await createReservationOneWay(sequelize);
   const reservationTwoWays = await createReservationTwoWays(sequelize)


await  passenger.hasMany(passengerReservationOneWay, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  await passengerReservationOneWay.belongsTo(passenger, {
    foreignKey: { name: "passenger_id",  allowNull: false },
  });


  await passenger.hasMany(reservationTwoWays, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  await  reservationTwoWays.belongsTo(passenger, {
    foreignKey: { name: "passenger_id",  allowNull: false },
  });
 

  await passenger.hasMany(passengerReservationTourist, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  await passengerReservationTourist.belongsTo(passenger, {
    foreignKey: { name: "passenger_id",  allowNull: false },
  });


  

  // sequelize.sync({ alter: true });
  // para que no puedan update las fk

  return {
    passengerReservationTourist,
    passenger,
    passengerReservationOneWay,
    reservationTwoWays
  };
}

async function tablesPrices(sequelize) {
  const passengerReservationOneWay = await createReservationOneWay(sequelize);
 const responseOneWay =  await createResponseOneWay(sequelize)
 const reservationTwoWays = await createReservationTwoWays(sequelize)
 const responseTwoWays =  await createResponseTwoWays(sequelize)
 const company = await createCompany(sequelize);

 responseOneWay.belongsTo(company, {
  foreignKey: { name: 'company_id', allowNull: false },
  onDelete: 'CASCADE',
});


//  reservationTwoWays.hasMany(responseTwoWays, {
//   foreignKey: { name: "id", allowNull: false },
// });
// responseTwoWays.belongsTo(reservationTwoWays, {
//   foreignKey: { name: "id",  allowNull: false },
// });


passengerReservationOneWay.hasMany(responseOneWay, {
  foreignKey: { name: "id_one_way", allowNull: false },
});
  // responseOneWay.belongsTo(passengerReservationOneWay, {
  //   foreignKey: { name: "id_one_way",  allowNull: false },
  // });
return {responseOneWay,responseTwoWays,}

}

async function createTables(sequelize) {
  const drivers = await tablesDrivers(sequelize);
  const responseDriver = await tablesPrices(sequelize);
  const passengers = await tablesPassenger(sequelize);
  return {responseDriver, drivers, passengers, };
}

export async function initDB() {
  
  const sequelize = await getConnection();
  const tables = await createTables(sequelize);
  sequelize.sync(
          // {force :true}
    );
  return { tables, sequelize };
}
