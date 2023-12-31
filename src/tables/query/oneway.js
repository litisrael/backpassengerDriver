
export async function queryAvailableDriversForTrip(sequelize, dayOfWeek ,id_one_way) {




  try {
    const results = await sequelize.query(`
    SELECT DISTINCT  *
    FROM extended_travel.company AS c
    JOIN extended_travel.vehicles AS v ON c.company_id = v.company_id
    LEFT JOIN extended_travel.${dayOfWeek} AS a ON v.vehicle_id = a.vehicle_id
    JOIN extended_travel.reservation_oneway AS r ON ST_DWithin(r.coordinates_destine::geography, c.work_zone::geography, c.radius)
     OR ST_DWithin(r.coordinates_origin::geography, c.work_zone::geography, c.radius)
    
    JOIN extended_travel.passenger AS p ON p.id = r.passenger_id
    WHERE r.number_of_passengers <= (
      SELECT number_of_seats FROM extended_travel.vehicles WHERE vehicle_id = v.vehicle_id
    )
   
    AND r.departure_hour NOT BETWEEN a.unavailable_starting AND a.unavailable_until

    AND r.id_one_way = '${id_one_way}';
  `);

  
  
  
  
    
  if (results[0].length === 0) {
    console.log('No drivers available');
    return 'No drivers available';
  }
   console.log(results);

  return results[0];
      } catch (error) {
        console.error(error);
        return error;
      }
    }
  












    //     try {
//       const encoding = 'utf-8';
//       const results = await sequelize.query(`
//       SELECT DISTINCT v.vehicle_id AS vehicle_id_vehicles,  *
//       FROM extended_travel.company AS c
//       JOIN extended_travel.vehicles AS v ON c.company_id = v.company_id
//       LEFT JOIN availability_drivers.${dayOfWeek} AS a ON v.vehicle_id = a.vehicle_id
//       JOIN extended_travel.reservation_oneway AS r ON ARRAY[c.work_zone]::text[] && ARRAY['${from_region}'::text]
//       JOIN extended_travel.passenger AS p ON p.id = r.passenger_id
//       WHERE r.number_of_passengers <= (
//         SELECT number_of_seats FROM extended_travel.vehicles WHERE vehicle_id = v.vehicle_id
//       )
//       AND (a IS NULL OR (r.day_week = '${dayOfWeek}' AND r.departure_hour NOT BETWEEN a.unavailable_starting AND a.unavailable_until))
//       AND r.id_one_way = ${id_one_way};
      
// `);
    
// if (results[0].length === 0) {
//   console.log('No drivers available');
//   return 'No drivers available';
// }
//  console.log(results[0]);
// return results[0];
//     } catch (error) {
//       console.error(error);
//       return error;
//     }
//   }