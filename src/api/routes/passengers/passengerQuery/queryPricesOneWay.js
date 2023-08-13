import express from "express";

export function queryPricesOneWayPassenger(DB) {
  const PricesOfDriversOneway = express.Router();

  PricesOfDriversOneway.get("/:PassengerId", async (req, res) => {
    const { PassengerId } = req.params;

    try {
      const query = `
        SELECT r.*
        FROM extended_travel.reservation_oneway pr
        INNER JOIN extended_travel.responseoneway r ON pr.id_one_way = r.id_one_way
        WHERE pr.passenger_id = :PassengerId;
      `;

      const results = await DB.sequelize.query(query, {
        replacements: { PassengerId: PassengerId },
        type: DB.sequelize.QueryTypes.SELECT,
      });

      if (results.length === 0) {
        console.log('No drivers available');
        return res.status(404).json({ message: 'No drivers available' });
      }

      console.log(results);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return PricesOfDriversOneway;
}
