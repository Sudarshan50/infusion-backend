import { json } from "express";
import { BadRequestError } from "../lib/customErrors.js";
import { redisClient } from "../lib/redis.js";
import { successResponse } from "../lib/responseUtils.js";
import { asyncErrorHandler } from "../middleware/errorHandler.js";
import Device from "../models/Device.js";

let device = {};


device.create = asyncErrorHandler(async (req, res) => {
    const {location} = req.body;
    if(!location) {
        throw new BadRequestError("Location is required");
    }
    const getDeviceCount = await Device.countDocuments();
    const deviceId = `PUMP_${String(getDeviceCount + 1).padStart(4, '0')}`;
    const newDevice = new Device({
        deviceId,
        location
    });
    await newDevice.save();
    successResponse(res,{device: newDevice}, "Device created successfully", 201);
});

device.createHealthCheck = asyncErrorHandler(async (req, res) => {
    const {deviceId,status} = req.body;
    if(!deviceId) {
        throw new BadRequestError("Device ID is required");
    }
    if(!status || !["healthy","issue","running","paused","stopped","degraded"].includes(status)) {
        throw new BadRequestError("Valid status is required");
    }
    const check = await redisClient.get(`device:${deviceId}:status`);
    if(!check)
    {
        await Device.updateOne({deviceId},{status:"healthy"});
    }
    const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    await redisClient.set(
        `device:${deviceId}:status`,
        JSON.stringify({ status: status, lastPing: indiaTime }),
        { EX: 10 }
    );
    successResponse(res,null, "Health check received", 200);
});


device.getStatus = asyncErrorHandler(async (req, res) => {
    const {deviceId} = req.params;
    const statusData = await redisClient.get(`device:${deviceId}:status`);
    let status = {status:"unknown",lastPing:null};
    if(statusData) {
        status = JSON.parse(statusData);
    } else {
        status.status = "degraded";
        const getDeviceDbStatus = await Device.findOne({deviceId});
        if(!getDeviceDbStatus){
            throw new BadRequestError("Invalid Device ID");
        }
        if(getDeviceDbStatus.status !== "degraded"){
            await Device.updateOne({deviceId},{status:"degraded"});
        }
    }
    successResponse(res, status, "Status retrieved successfully", 200);
});





export default device;
