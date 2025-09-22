import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { registerSchema, loginSchema, verifySchema } from "../schemas/authSchemas.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(registerSchema),
    authControllers.registerController
);

authRouter.post(
    "/verify",
    validateBody(verifySchema),
    authControllers.resendVerifyController
);

authRouter.get("/verify/:verificationToken", authControllers.verifyController);

authRouter.post(
    "/login",
    validateBody(loginSchema),
    authControllers.loginController
);

authRouter.get("/current", authenticate, authControllers.getCurrentController);
authRouter.post("/logout", authenticate, authControllers.logoutController);
authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    authControllers.updateAvatarController
);

export default authRouter;
