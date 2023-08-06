import express from "express";
import { createServers } from "./routes/index.js";
import cors from "cors";
export const initRouterDriver = async () => {
  const routers = await createServers();
  const app = express();

  //  midelwer
  // app.use(morgan("dev"))
  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(cors());
  app.use(express.json());
  
  app.use("/company", routers.company);
  app.use("/vehicles", routers.vehicles);
  app.use("/availabilitytourist", routers.vehiclesAvailabilityTourist);
  app.use("/reservationoneway", routers.ReservationOneWay)
  app.use("/ReservationTwoWays", routers.ReservationTwoWays)
  app.use("/passenger", routers.passenger);
  app.use("/passengerReserve", routers.passengerReservation);
  app.use("/day", routers.DaysOfWeek);
  app.use("/day", routers.allDays);
  app.use("/Register", routers.Register);
  app.use("/responseoneway", routers.responseOneway);
  return app;
};
