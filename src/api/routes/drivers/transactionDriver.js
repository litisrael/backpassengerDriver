import express from "express";

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
        include: [
          {
            model: vehicle,
            include: [
              ...daysOfWeek,
              { model: vehiclesAvailabilityTourist },
            ],
          },
        ],
      });
  
      if (!companyData) {
        return res.status(404).json({
          message: "Company not found for the given auth_id",
        });
      }
  
      return res.json({
        company: companyData,
        vehicles: companyData.vehicles,
      });
    } catch (error) {
      console.error("Error while fetching data:", error);
      return res.status(500).json({
        message: "Something went wrong while fetching data",
        error: error.message,
      });
    }
  });
  





  FormRegister.post("/", async (req, res) => {
  
    // console.log(req.body.data);
    // console.log(req.body.data.formVehicle);
    // console.log(req.body.data.formDays);
    // console.log(req.body.data.calendarDisableTourist);
    try {
      trx = await sequelize.transaction(); 
  
      const company = await DB.drivers.company.create(req.body.data.formCompany, {
        transaction: trx,
      });
  
      const companyId = company.company_id; // Obtener el UUID de la compañía creada
  
      const vehicleData = req.body.data.formVehicle.vehicle.map(vehicle => ({
        ...vehicle,
        company_id: companyId, // Asignar el UUID de la compañía al campo "company_id" del vehículo
      }));
  
      const vehicles = await DB.drivers.vehicle.bulkCreate(vehicleData, {
        transaction: trx,
      });
      let calendarDays = [];

      let availableTourist =[]

      for (const vehicle of vehicles) {
        const vehicleId = vehicle.vehicle_id;
      
        
        const disableCalendarData = req.body.data.calendarDisableTourist.calendarDisable.map(dates =>({
          ...dates, vehicle_id: vehicleId,
        }))


         availableTourist = await DB.drivers.vehiclesAvailabilityTourist.bulkCreate(disableCalendarData, {
          transaction: trx,
        });
        for (const dayData of req.body.data.formDays.days) {
          const { day, data } = dayData;
          const table = DB.drivers.daysOfWeek.find(
            (table) => table.tableName === day
            );
            const recordsToInsert = data.map(dataItem => ({
              ...dataItem,
              vehicle_id: vehicleId,
            }));
           
        
            const  dataDay = await table.bulkCreate(recordsToInsert, {
              transaction: trx,
              
            });
        
            calendarDays.push({
              day,
              dataDay
            });
         
        
          }
        }
        
        
      
      
      await trx.commit()  
      .then(() => {
        
        return res.json({
          company,
          vehicles,
           calendarDays,
          availableTourist
        });
      })
    } catch (error) {
      console.log("error");
  
     
        trx.rollback();
      
      return res.status(500).json({
        message: error.message,
      });
    }
  });
  

  return FormRegister;
}
