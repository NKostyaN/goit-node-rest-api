import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";

const avatarsDir = path.resolve("public", "avatars");

export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (payload) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const avatarURL = gravatar.url(payload.email, {
        s: "128",
        d: "initials",
        protocol: "https",
    });
    return User.create({
        ...payload,
        password: hashedPassword,
        avatarURL: avatarURL,
    });
};

export const loginUser = async (payload) => {
    const { email, password } = payload;
    const user = await findUser({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
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
