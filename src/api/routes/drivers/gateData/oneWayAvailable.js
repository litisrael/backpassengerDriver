import express from "express";

export function getDriversAvailableOneWay(DB) {
// creo que es mejor mdificar  q sean solo join y no left join
    const DriversAvailable = express.Router();
    DriversAvailable.get("/:auth_id", async (req, res) => {
        const { auth_id } = req.params;

        try {
            const results = await DB.sequelize.query(`
                
SELECT DISTINCT *
FROM extended_travel.company AS c
JOIN extended_travel.vehicles AS v ON c.company_id = v.company_id
JOIN extended_travel.reservation_oneway AS r ON ST_DWithin(r.coordinates_destine::geography, c.work_zone::geography, c.radius)
     OR ST_DWithin(r.coordinates_origin::geography, c.work_zone::geography, c.radius)
JOIN extended_travel.passenger AS p ON p.id = r.passenger_id
LEFT JOIN availability_drivers.Sunday AS sun ON v.vehicle_id = sun.vehicle_id AND r.day_week = 'Sunday'
LEFT JOIN availability_drivers.Monday AS mon ON v.vehicle_id = mon.vehicle_id AND r.day_week = 'Monday'
LEFT JOIN availability_drivers.Tuesday AS tue ON v.vehicle_id = tue.vehicle_id AND r.day_week = 'Tuesday'
LEFT JOIN availability_drivers.Wednesday AS wed ON v.vehicle_id = wed.vehicle_id AND r.day_week = 'Wednesday'
LEFT JOIN availability_drivers.Thursday AS thu ON v.vehicle_id = thu.vehicle_id AND r.day_week = 'Thursday'
LEFT JOIN availability_drivers.Friday AS fri ON v.vehicle_id = fri.vehicle_id AND r.day_week = 'Friday'
LEFT JOIN availability_drivers.Saturday AS sat ON v.vehicle_id = sat.vehicle_id AND r.day_week = 'Saturday'
WHERE r.number_of_passengers <= (
    SELECT number_of_seats FROM extended_travel.vehicles WHERE vehicle_id = v.vehicle_id
)
AND (
    (r.day_week = 'Sunday' AND (sun.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN sun.unavailable_starting AND sun.unavailable_until))
    OR
    (r.day_week = 'Monday' AND (mon.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN mon.unavailable_starting AND mon.unavailable_until))
    OR
    (r.day_week = 'Tuesday' AND (tue.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN tue.unavailable_starting AND tue.unavailable_until))
    OR
    (r.day_week = 'Wednesday' AND (wed.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN wed.unavailable_starting AND wed.unavailable_until))
    OR
    (r.day_week = 'Thursday' AND (thu.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN thu.unavailable_starting AND thu.unavailable_until))
    OR
    (r.day_week = 'Friday' AND (fri.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN fri.unavailable_starting AND fri.unavailable_until))
    OR
    (r.day_week = 'Saturday' AND (sat.unavailable_starting IS NULL OR r.departure_hour NOT BETWEEN sat.unavailable_starting AND sat.unavailable_until))
)

                    AND c.company_id = (
                        SELECT company_id
                        FROM extended_travel.company
                        WHERE auth_id = :auth_id
                    );
            `, {
                replacements: { auth_id },
                type: DB.sequelize.QueryTypes.SELECT
            });

            if (results.length === 0) {
                console.log('No drivers available');
                return res.status(404).json({
                    message: `No drivers available`,
                });
            }

            res.json(results);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message,
            });
        }
    });
    return DriversAvailable;
}
