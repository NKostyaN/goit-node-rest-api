import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const avatarsDir = path.resolve("public", "avatars");
const { BASE_URL } = process.env;

const createVerifyEmail = ({ verificationToken, email }) => ({
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
});

export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (payload) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const avatarURL = gravatar.url(payload.email, {
        s: "128",
        d: "initials",
        protocol: "https",
    });
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...payload,
        password: hashedPassword,
        avatarURL: avatarURL,
        verificationToken: verificationToken,
    });

    const verifyEmail = createVerifyEmail({
        verificationToken,
        email: payload.email,
    });

    await sendEmail(verifyEmail);

    return newUser;
};

export const resendVerifyUser = async ({ email }) => {
    const user = await findUser({ email });
    if (!user) throw HttpError(404, "User not found");
    if (user.verify) throw HttpError(400, "Verification has already been passed");

    const verifyEmail = createVerifyEmail({
        verificationToken: user.verificationToken,
        email,
    });
    await sendEmail(verifyEmail);
};

export const verifyUser = async (verificationToken) => {
    const user = await findUser({ verificationToken: verificationToken });
    if (!user) throw HttpError(404, "User not found");
    if (user.verify) throw HttpError(400, "Verification has already been passed");

    await user.update({ verify: true, verificationToken: null });
};

export const loginUser = async (payload) => {
    const { email, password } = payload;
    const user = await findUser({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const tokenPayload = { id: user.id };
    const token = createToken(tokenPayload);

    await user.update({ token });

    return {
        token,
        user: { email: user.email },
    };
};

export const logoutUser = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw HttpError(401, "Not authorized");
    }

    await user.update({ token: null });
};

export const updateAvatar = async (id, file) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw HttpError(401, "Not authorized");
    }

    if (!file) throw HttpError(400, "Avatar file is required");

    let avatarURL = null;
    if (file) {
        const newPath = path.join(avatarsDir, file.filename);
        await fs.rename(file.path, newPath);
        avatarURL = path.join("avatars", file.filename);
    }

    await user.update({ avatarURL: avatarURL });
    return {
        avatarURL: user.avatarURL,
    };
};
