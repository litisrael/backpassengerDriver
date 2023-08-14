import express from "express";

export function queryPricesOneWayPassenger(DB) {
  const PricesOfDriversOneway = express.Router();

  PricesOfDriversOneway.get("/:auth_id", async (req, res) => {
    const { auth_id } = req.params;

    try {
      const query = `
      SELECT
      p.auth_id , r.* , pr.*, c.*
   FROM
     extended_travel.passenger p
   INNER JOIN
     extended_travel.reservation_oneway pr ON p.id = pr.passenger_id
   INNER JOIN
     extended_travel.responseoneway r ON pr.id_one_way = r.id_one_way
     INNER JOIN
  extended_travel.company c ON r.company_id = c.company_id
   WHERE
     p.auth_id = 'google-oauth2|104855243921331044464';
      `;

      const results = await DB.sequelize.query(query, {
        replacements: { auth_id: auth_id },
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
