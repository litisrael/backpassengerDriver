import express from "express";
import { DriversForOneWay } from "../../../tables/passengers/reserve.one.way.js";

export function passengerReservationOneWay(DB) {
  const passengerReservationOneWay = express.Router();

  passengerReservationOneWay.post("/", async (req, res) => {
    console.log(DriversForOneWay)
    try {
      const newReservation = await DB.passengers.passengerReservationOneWay.create(req.body);
console.log(req.body)

      return res.json({newReservation, DriversForOneWay});
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationOneWay.get("/", async (req, res) => {
    try {
      const reservations = await DB.passengers.passengerReservationOneWay.findAll(
       
      );
      return res.json(reservations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationOneWay.get("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.passengerReservationOneWay.findByPk(
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

  passengerReservationOneWay.put("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.passengerReservationOneWay.findByPk(
        reservation_id
      );
      if (!reservation) {
        return res
          .status(404)
          .json({ message: `Reservation with id ${reservation_id} not found` });
      }

      await reservation.update(req.body);

      return res.json(reservation);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  passengerReservationOneWay.delete("/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;

    try {
      const reservation = await DB.passengers.passengerReservationOneWay.findByPk(
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

  return passengerReservationOneWay;
}
