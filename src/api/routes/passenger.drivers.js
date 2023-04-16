import express from "express";

export function passengerDriverRoute(DB) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const results = await DB.query(`
        SELECT DISTINCT p.name AS passenger_name, p.mail AS passenger_mail, pr.number_of_passengers, pr.start_day, pr.end_day, d.name AS driver_name, d.mail AS driver_mail, d.number_of_passengers AS driver_seats
        FROM extended_travel.passenger p
        LEFT JOIN extended_travel.Passenger_reservation pr ON pr.passenger_id = p.id
        LEFT JOIN extended_travel.drivers d ON pr.number_of_passengers <= d.number_of_passengers
        LEFT JOIN extended_travel.driver_availability da ON d.driver_id = da.driver_id AND (da.occupied_from > pr.end_day OR da.occupied_to < pr.start_day)
        WHERE da.driver_id IS NULL OR pr.id IS NOT NULL;
      `);
      return res.json(results[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  return router;
}
