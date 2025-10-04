import e from "express";
import auth from "../controllers/authController.js";

const authRouter = e.Router();

authRouter.post("/create", auth.createUser);
authRouter.post("/login", auth.login);

export default authRouter;
