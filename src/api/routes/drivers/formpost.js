import express from "express";

export function createFormRegister(DB, sequelize) {
  const FormRegister = express.Router();
  let trx = null; // Inicializa trx como null

  FormRegister.post("/", async (req, res) => {
    console.log(req.body.data.formDays.days);
  
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
      let result = [];

      for (const vehicle of vehicles) {
        const vehicleId = vehicle.vehicle_id;
      
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
        
        result.push(dataDay)
            // console.log(result); // Resultado de la inserción en la tabla del día
          }
        }
        // const availableTourist = await DB.drivers.vehiclesAvailabilityTourist.bulkCreate("req.body.data", {
        //   transaction: trx,
        // });
    
        
      
      
      await trx.commit()  
      .then(() => {
        
        return res.json({
          company,
          vehicles,
          result
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
