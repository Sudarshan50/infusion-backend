import e from "express";
import device from "../controllers/deviceController.js";


const deviceRouter = e.Router()

deviceRouter.post('/create',device.create);
deviceRouter.post('/health',device.createHealthCheck);
deviceRouter.get('/status/:deviceId',device.getStatus);


export default deviceRouter;