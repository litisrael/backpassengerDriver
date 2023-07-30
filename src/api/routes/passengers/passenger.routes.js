import express from "express";

export function passengerRouter(DB) {
  const passengerRouter = express.Router();

  passengerRouter.post("/", async (req, res) => {
    try {
      const newPassenger = await DB.passengers.passenger.create(req.body);
      return res.json(newPassenger);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerRouter.get("/", async (req, res) => {
    try {
      const passengers = await DB.passengers.passenger.findAll(
        // {attributes: ["id", "name", "mail"] }
      );
      return res.json(passengers);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerRouter.get("/:authId", async (req, res) => {
    const { authId } = req.params;

    try {
  
      const passenger = await DB.passengers.passenger.findOne({ where: { auth_id: authId } });

      if (!passenger) {
        return res
          .status(404)
          .json({ message: `Passenger with authId ${authId} not found` });
      }
      return res.json(passenger);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerRouter.put("/:auth_id", async (req, res) => {
    const { auth_id } = req.params;

    try {
      const passenger = await DB.passengers.passenger.findOne({ where: { auth_id: auth_id } });
      if (!passenger) {
        return res
          .status(404)
          .json({ message: `Passenger with auth_id ${auth_id} not found` });
      }

      await passenger.update(req.body);

      return res.json(passenger);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerRouter.delete("/:passenger_id", async (req, res) => {
    const { passenger_id } = req.params;

    try {
      const passenger = await DB.passengers.passenger.findByPk(passenger_id);
      if (!passenger) {
        return res
          .status(404)
          .json({ message: `Passenger with id ${passenger_id} not found` });
      }

      await passenger.destroy();

      res.status(200).json({
        message: "Successfully deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });


  
  return passengerRouter;
}
