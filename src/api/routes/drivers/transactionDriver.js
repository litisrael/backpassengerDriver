import express from "express";
import { dayOfWeekString } from "../../../tables/utility.js";

export function createFormRegister(DB, sequelize) {
  const FormRegister = express.Router();
  let trx = null; // Inicializa trx como null

  FormRegister.get("/:auth0Id", async (req, res) => {
    const auth0Id = req.params.auth0Id;
    try {
      const { company, vehicle, daysOfWeek, vehiclesAvailabilityTourist } = DB.drivers;
  
      // Buscar la compañía basada en el auth_id
      const companyData = await company.findOne({
        where: { auth_id: auth0Id },
      });
  
      if(!companyData){
        return res.status(500).json({
          message: "  sos muy feoooo y no estas subscrito",
        
        });}
      // Buscar los vehículos relacionados con la compañía
      const vehicles = await vehicle.findAll({
        where: { company_id: companyData.company_id }, // Ajustar al nombre real del campo en tu modelo de vehículo
      });
  
      // Inicializar el objeto de datos con la estructura deseada
      const data = {
        company: {
          ...companyData.dataValues,
          vehicles: [],
        },
      };
  
      // Para cada vehículo, busca sus días de la semana y disponibilidad de turistas
      for (const vehicleData of vehicles) {
        const vehicleDaysData = {};
  
        for (const dayModel of daysOfWeek) {
          const dayData = await dayModel.findAll({
            where: { vehicle_id: vehicleData.vehicle_id },
          });
          
    //  tendria que verificar que el nombre del dia dayModel sea el mismo dia dayData
          vehicleDaysData[dayModel.name] = dayData;
        }
  
        const availabilities = await vehiclesAvailabilityTourist.findAll({
          where: { vehicle_id: vehicleData.vehicle_id },
        });
  
        // Agregar los datos del vehículo actual al objeto de datos
        data.company.vehicles.push({
          ...vehicleData.dataValues,
          daysData: vehicleDaysData,
          vehiclesAvailabilityTourist: availabilities,
        });
      }
  
      res.json(data);
  
  
  
    } catch (error) {
      console.error("Error while fetching data:", error);
      return res.status(500).json({
        message: "Something went wrong while fetching data",
        error: error.message,
      });
    }
  });

  FormRegister.post("/", async (req, res) => {

    let trx; 
    try {
      trx = await sequelize.transaction();

      const company = await DB.drivers.company.create(
        req.body.data.formCompany,
        {
          transaction: trx,
        }
      );
     

      const companyId = company.company_id; // Obtener el UUID de la compañía creada

      const vehicleData = req.body.data.formVehicle.vehicle.map((vehicle)=> {
        const { days, calendarDisable, ...vehicleWithoutDaysAndCalendarDisable } = vehicle;
        return {
          ...vehicleWithoutDaysAndCalendarDisable,
          company_id: companyId,
        };
      });

      // console.log("vehicleData", vehicleData);


      const vehicles = await DB.drivers.vehicle.bulkCreate(vehicleData, {
        transaction: trx,
      });
     const vehicleIds = vehicles.map((vehicle) => vehicle.vehicle_id);

  // Obtener los datos de los vehículos del cuerpo de la solicitud
  const vehicleDataItem = req.body.data.formVehicle.vehicle;

  // Crear un array para almacenar las promesas
 
  for (let index = 0; index < vehicleDataItem.length; index++) {
    const item = vehicleDataItem[index];
    const { calendarDisable, days } = item;
    const vehicleId = vehicleIds[index];

    const availabilityData = {
      disable_from: calendarDisable.disable_from,
      disable_until: calendarDisable.disable_until,
      vehicle_id: vehicleId,
    };
    const availableTourist = await DB.drivers.vehiclesAvailabilityTourist.bulkCreate(
      [availabilityData] ,
      {
        transaction: trx,
      }
    );

  
    for (const dayData of days) {
      const { day, data } = dayData;

      // Encontrar la tabla correspondiente para el día
      const tableDays = DB.drivers.daysOfWeek.find(
        (table) => table.tableName === day
      );

      // Crear registros de días
      const recordsToInsert = data.map((dataItem) => ({
        ...dataItem,
        vehicle_id: vehicleId,
      }));

      await tableDays.bulkCreate(recordsToInsert, {
        transaction: trx,
      });
    }


  
  }


  await trx.commit();

  
        return res.json({
          company,
          vehicles,
       
        });
 
    } catch (error) {
      console.log("error",error);

      trx.rollback();

      return res.status(500).json({
        message: error.message,
      });
    }
  });

  FormRegister.put("/:auth0Id", async (req, res) => {
    const auth0Id = req.params.auth0Id;

    trx = await sequelize.transaction();
    try {
      const { company, vehicle, daysOfWeek, vehiclesAvailabilityTourist } =
        DB.drivers;

      // Buscar la compañía basada en el auth_id
      const companyData = await company.findOne({
        where: { auth_id: auth0Id },
        include: [
          {
            model: vehicle,
            include: [...daysOfWeek, { model: vehiclesAvailabilityTourist }],
          },
        ],
        transaction: trx,
      });

      if (!companyData) {
        return res.status(404).json({
          message: "Company not found for the given auth_id",
        });
      }

      // Actualizar información de la compañía
      await company.update(req.body.company, {
        where: { auth_id: auth0Id },
        transaction: trx,
      });

      // Actualizar información de los vehículos
      for (const vehicleData of req.body.company.Vehicles) {
        const vehicleId = vehicleData.vehicle_id;

        // Actualizar información del vehículo
        await vehicle.update(vehicleData, {
          where: { vehicle_id: vehicleId },
          transaction: trx,
        });

        // Actualizar disponibilidad de turistas para el vehículo actual
        for (const availabilityData of vehicleData.VehicleAvailabilities) {
          const availabilityId = availabilityData.id;

          // Obtener el modelo de disponibilidad de turistas por ID
          const availability = await vehiclesAvailabilityTourist.findByPk(
            availabilityId
          );

          if (availability) {
            // Actualizar los datos de disponibilidad de turistas
            await availability.update(availabilityData, {
              transaction: trx,
            });
          }
        }

        // Acceder a los datos de los días para el vehículo actual
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        for (const dayProperty of days) {
          // agrege a los dias  s porque por algun motivo se guradaron s
          const bla = `${dayProperty}s`;

          const dayDataList = vehicleData[bla];

          const tableIndex = days.indexOf(dayProperty);
          const table = daysOfWeek[tableIndex];
          console.log(`Updating records for ${dayProperty}`);

          for (const dayData of dayDataList) {
            const dayDataId = dayData.id;

            try {
              // Utiliza el método update del modelo correspondiente
              await table.update(dayData, {
                where: { id: dayDataId },
                transaction: trx,
              });
              console.log(`Record updated successfully`);
            } catch (updateError) {
              console.error(`Error while updating record:`, updateError);
            }
          }
        }
      }

      await trx.commit();

      return res.json({
        message: "Data updated successfully",
      });
    } catch (error) {
      console.error("Error while updating data:", error);

      if (trx) {
        await trx.rollback();
      }

      return res.status(500).json({
        message: "Something went wrong while updating data",
        error: error.message,
      });
    }
  });

  return FormRegister;
}
