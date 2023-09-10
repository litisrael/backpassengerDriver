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
// let company = null;
// let passenger = null
// let passengerReservationOneWay =null
// let reservationTwoWays = null;

async function tablesDrivers(sequelize) {
 const  company = await createCompany(sequelize);
  const vehicle = await createVehicle(sequelize);
  const vehiclesAvailabilityTourist = await createVehicleAvailabilityTourist(
    sequelize
  );
  const daysOfWeek = await createDaysOfWeek(sequelize);

  return {
    company,
    vehicle,
    vehiclesAvailabilityTourist,
    daysOfWeek,
  };
}

function defineDriversRelations({
  company,
  vehicle,
  vehiclesAvailabilityTourist,
  daysOfWeek,
}) {
  company.hasMany(vehicle, {
    foreignKey: {
      name: "company_id",
      allowNull: false,
    },
  });

  vehicle.belongsTo(company, {
    foreignKey: {
      name: "company_id",
      allowNull: false,
    },
  });

  vehicle.hasMany(vehiclesAvailabilityTourist, {
    foreignKey: {
      name: "vehicle_id",
      allowNull: false,
    },
  });

  vehiclesAvailabilityTourist.belongsTo(vehicle, {
    foreignKey: {
      name: "vehicle_id",
      allowNull: false,
    },
  });

  for (const dayOfWeek in daysOfWeek) {
    vehicle.hasMany(daysOfWeek[dayOfWeek], {
      foreignKey: {
        name: "vehicle_id",
        allowNull: false,
      },
    });

    daysOfWeek[dayOfWeek].belongsTo(vehicle, {
      foreignKey: {
        name: "vehicle_id",
        allowNull: false,
      },
    });
  }
}

async function tablesPassenger(sequelize) {
  const passenger = await createPassenger(sequelize);
  const passengerReservationTourist = await createReservationTourist(sequelize);
  const passengerReservationOneWay = await createReservationOneWay(sequelize);
  const reservationTwoWays = await createReservationTwoWays(sequelize);

  // sequelize.sync({ alter: true });
  // para que no puedan update las fk

  return {
    passenger,
    passengerReservationTourist,
    passengerReservationOneWay,
    reservationTwoWays,
  };
}

function definePassengerRelations({
  passenger,
  passengerReservationTourist,
  passengerReservationOneWay,
  reservationTwoWays,
}) {
  passenger.hasMany(passengerReservationOneWay, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  passengerReservationOneWay.belongsTo(passenger, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  passenger.hasMany(reservationTwoWays, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  reservationTwoWays.belongsTo(passenger, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  passenger.hasMany(passengerReservationTourist, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });

  passengerReservationTourist.belongsTo(passenger, {
    foreignKey: { name: "passenger_id", allowNull: false },
  });
}

async function tablesPrices(sequelize) {
  // const  passengerReservationOneWay = await createReservationOneWay(sequelize);
  const responseOneWay = await createResponseOneWay(sequelize);
  // const company = await createCompany(sequelize);
  // const  reservationTwoWays = await createReservationTwoWays(sequelize)
  const responseTwoWays = await createResponseTwoWays(sequelize);

  return { responseOneWay, responseTwoWays };
}

function definePricesRelations({
  company,
  passengerReservationOneWay,
  responseOneWay,
  reservationTwoWays,
  responseTwoWays,
})
 {

  responseOneWay.hasMany(company, {
    foreignKey: {
      name: "company_id",
      allowNull: true,

    },
  });

  // company.belongsTo(responseOneWay, {
  //   foreignKey: {
  //     name: "company_id",
  //     allowNull: false,
  //   },
  // });
  responseOneWay.belongsTo(passengerReservationOneWay, {
    foreignKey: { name: "id_one_way", allowNull: false },
  });

  responseOneWay.belongsTo(passengerReservationOneWay, {
    foreignKey: { name: "id_one_way", allowNull: false },
  });

  reservationTwoWays.hasMany(responseTwoWays, {
    foreignKey: { name: "id", allowNull: false },
  });
  responseTwoWays.belongsTo(reservationTwoWays, {
    foreignKey: { name: "id", allowNull: false },
  });

  passengerReservationOneWay.hasMany(responseOneWay, {
    foreignKey: { name: "id_one_way", allowNull: false },
  });
}



async function createTables(sequelize) {
  const drivers = await tablesDrivers(sequelize);
  const passengers = await tablesPassenger(sequelize);

  const responseDriver = await tablesPrices(sequelize);

  defineDriversRelations(drivers);
  definePassengerRelations(passengers);
  definePricesRelations({
     company: await createCompany(sequelize),
    responseOneWay: responseDriver.responseOneWay,
    passengerReservationOneWay: await createReservationOneWay(sequelize),
    reservationTwoWays: passengers.reservationTwoWays,
    responseTwoWays: responseDriver.responseTwoWays,
  });
  return {
    drivers,
    passengers,
    responseDriver,
  };
}

export async function initDB() {
  const sequelize = await getConnection();

  // await sequelize.createSchema('extended_travel');
  const tables = await createTables(sequelize);

  sequelize
    .sync(
    // {force :true}
    // { alter: true }
    )
  return { tables, sequelize };
}
