import { QueryTypes, Op } from 'sequelize';

export async function queryAvailableDriversForTrip(sequelize, id) {
  try {
    const results = await sequelize.query(`
      SELECT DISTINCT
        p.passenger_name,
        p.passenger_mail,
        p.passenger_cell,
        pr.number_of_passengers,
        v.number_of_seats,
        pr.start_day,
        pr.end_day,
        vat.disable_from AS available_from, -- Cambio de nombre de columna
        vat.disable_until AS available_to, -- Cambio de nombre de columna
        c.company_name,
        c.company_mail
      FROM extended_travel.passenger p
      LEFT JOIN extended_travel.reserve_tourist pr ON pr.passenger_id = p.id
      LEFT JOIN extended_travel.vehicles v ON pr.number_of_passengers <= (
        SELECT number_of_seats FROM extended_travel.vehicles WHERE vehicle_id = v.vehicle_id
      )
      LEFT JOIN availability_drivers.vehicle_availability_tourist vat ON vat.vehicle_id = v.vehicle_id
        AND (
          pr.start_day > vat.disable_until OR -- Cambio de operador de comparación
          pr.end_day < vat.disable_from -- Cambio de operador de comparación
        )
      LEFT JOIN extended_travel.company c ON c.company_id = v.company_id
      WHERE
        c.is_work_available_multiple_days = true
        AND pr.id = ${id};
    `);

    console.log(results[0]);
    return results[0];
  } catch (error) {
    console.error(error);
    return error;
  }
}

  export async function validateDateNotBetweenExisting(Model, startDate, endDate) {
    const query = `
      SELECT * FROM availability_drivers.vehicle_availability_tourist
      WHERE vehicle_id = :vehicleId
      AND ((disable_from <= :startDay AND :startDay <= disable_until) OR
           (disable_until <= :startDay AND :endDay <= disable_until) OR
           (:startDay <= disable_from AND disable_until <= :endDay));
    `;
  
    const existingAvailability = await Model.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        vehicleId: Model.vehicle_id,
        startDay: startDate,
        endDay: endDate,
      },
    });
  
    if (existingAvailability.length > 0) {
      throw new Error(`The insertion date is within an existing range.`);
    }
  }
  