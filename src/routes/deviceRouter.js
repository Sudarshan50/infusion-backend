import e from "express";
import device from "../controllers/deviceController.js";

const deviceRouter = e.Router();

deviceRouter.post("/create", device.create);
deviceRouter.post("/health", device.createHealthCheck);

// Device control endpoints
deviceRouter.post("/start/:deviceId", device.start);
deviceRouter.post("/stop/:deviceId", device.stop);
deviceRouter.post("/pause/:deviceId", device.pause);
deviceRouter.post("/resume/:deviceId", device.resume);

export default deviceRouter;
