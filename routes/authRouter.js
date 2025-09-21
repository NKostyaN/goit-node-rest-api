import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(registerSchema),
    authControllers.registerController
);

authRouter.post(
    "/login",
    validateBody(loginSchema),
    authControllers.loginController
);

authRouter.get("/current", authenticate, authControllers.getCurrentController);
authRouter.post("/logout", authenticate, authControllers.logoutController);

export default authRouter;
