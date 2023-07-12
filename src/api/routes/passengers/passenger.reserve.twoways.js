import express from "express";


export function passengerReservationTwoWays(DB) {
  const passengerReservationTwoWays = express.Router();

  passengerReservationTwoWays.post("/", async (req, res) => {
    console.log(req.body)
    try {
      const newReservation = await DB.passengers.reservationTwoWays.create(req.body);


      return res.json(newReservation);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationTwoWays.get("/", async (req, res) => {
    try {
      const reservations = await DB.passengers.reservationTwoWays.findAll(
       
      );
      return res.json(reservations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationTwoWays.get("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.reservationTwoWays.findByPk(
        reservation_id
      );
      if (!reservation) {
        return res
          .status(404)
          .json({ message: `Reservation with id ${reservation_id} not found` });
      }
      return res.json(reservation);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationTwoWays.put("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.reservationTwoWays.findByPk(
        reservation_id
      );
      if (!reservation) {
        return res
          .status(404)
          .json({ message: `Reservation with id ${reservation_id} not found` });
      }

      await reservation.update(req.body);

      return res.json({reservation});
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationTwoWays.delete("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.reservationTwoWays.findByPk(
        reservation_id
      );
      if (!reservation) {
        return res
          .status(404)
          .json({ message: `Reservation with id ${reservation_id} not found` });
      }

      await reservation.destroy();

      
      res.status(200).json({
        message: "Successfully deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  return passengerReservationTwoWays;
}
