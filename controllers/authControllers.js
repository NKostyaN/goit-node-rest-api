import * as authServices from "../services/authServices.js";

const registerController = async (req, res, next) => {
    try {
        const { email, subscription, avatarURL } =
            await authServices.registerUser(req.body);
        return res
            .status(201)
            .json({ user: { email, subscription, avatarURL } });
    } catch (error) {
        next(error);
    }
};

const resendVerifyController = async (req, res) => {
    await authServices.resendVerifyUser(req.body);

    res.status(200).json({
        message: "Verification email sent",
    });
};

const verifyController = async (req, res) => {
    const { verificationToken } = req.params;
    await authServices.verifyUser(verificationToken);

    res.status(200).json({
        message: "Verification successful",
    });
};

const loginController = async (req, res, next) => {
    try {
        const result = await authServices.loginUser(req.body);
        return res.json(result);
    } catch (error) {
        next(error);
    }
};

const getCurrentController = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        return res.status(200).json({ email, subscription });
    } catch (error) {
        next(error);
    }
};

const logoutController = async (req, res, next) => {
    try {
        await authServices.logoutUser(req.user.id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const updateAvatarController = async (req, res, next) => {
    try {
        const resault = await authServices.updateAvatar(req.user.id, req.file);
        return res.status(200).json(resault);
    } catch (error) {
        next(error);
    }
};

export default {
    registerController,
    resendVerifyController,
    verifyController,
    loginController,
    getCurrentController,
    logoutController,
    updateAvatarController,
};
