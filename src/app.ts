import * as appEvents from "@vyro-x/app-events";
// import * as appEvents from "../../vyro/packages/app-events/lib";
import bodyParser from "body-parser";
import express from "express";
import * as routes from "./routes";

const app = express();
app.use(bodyParser.json());

/**
 * Reporting Example
 *
 * Example of a custom route you might define in your own API.
 *
 * This route is unsecured for demonstration purposes — you can add
 * authentication or other middleware as needed.
 *
 * In this example, the route could be used by your frontend to trigger
 * report generation or retrieve data.
 */
app.get("/report", routes.reportHandler);

/**
 * Event Example
 *
 * This endpoint is triggered by Vyro when a new enquiry is created.
 *
 * It uses `appEvents.eventMiddleware` to validate the request:
 * - Verifies the request signature using a public JWKS key
 * - Ensures the request is trusted and hasn't been tampered with
 */
app.post(
  "/events/enquiry-created",
  (req, res, next) => {
    console.log("Received event:", req.body);
    next();
  },
  appEvents.eventMiddleware,
  routes.eventHandler
);

/**
 * Inventory Example
 *
 * Example of a custom route you might define in your own API.
 *
 * This route is unsecured for demonstration purposes — you can add
 * authentication or other middleware as needed.
 *
 * In this example, the route could be used by your upstream systems to
 * create inventory items.
 */
app.post("/inventory", routes.inventoryHandler);

/**
 * Global error handler middleware.
 * Catches any unhandled errors and sends a 500 response.
 */
app.use((err, req, res, next) => {
  res.status(500).json(err);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
