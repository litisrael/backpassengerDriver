import express from "express";

export function responseDriverOneWay(DB) {
  const crud = DB.responseDriver.responseOneWay
    const responseDriver = express.Router();
    responseDriver.post("/", async (req, res) => {
      try {
        const newResponse = await crud.create(req.body );
        return res.json(newResponse);
      } catch (error) {
        return res.status(500).json({
          message: error.message,
        });
      }
    });
  
  

  responseDriver.get("/", async (req, res) => {
    try {
      const response = await crud.findAll();
      return res.json(response);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });
// el param tendria q modificar
  responseDriver.get("/:company_id", async (req, res) => {
    const { company_id } = req.params;

    

    try {
      const trip = await crud.findByPk(company_id)
      
      if (!trip) {
        return res.status(404).json({
          message: ` User not found`,
        });
      }
      res.json(trip);
      
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });


//   tendere qu poner 2 opciones de borrado  para el driver y el passanger
  responseDriver.delete("/:company_id", async (req, res) => {
    const { company_id } = req.params;

    try {
      const company = await crud.findOne({
        where: { company_id: company_id },
      });

      if (!company) {
        return res.status(404).json({
          message: ` User not found`,
        });
      }

      await crud.destroy({
        where: { company_id: company_id },
      });
      res.status(200).json({
        message: "Successfully deleted",
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

//   responseDriver.put("/:company_id", async (req, res) => {
//     try {
//       const {  company_id } = req.params;

//       const company = await crud.findByPk(company_id);
//       if (!company) {
//         return res
//           .status(404)
//           .json({ message: `Driver with id ${company_id} not found` });
//       }
     
//       await company.update(req.body);
      

//       res.json(company);
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   });

  return responseDriver;
}
