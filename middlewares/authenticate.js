import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";
import { verifyToken } from "../helpers/jwt.js";

const authenticate = async (req, _res, next) => {
    try {
        const authorization = req.get("Authorization") || "";
        const [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw HttpError(401, "Not authorized");
        }

        const { payload, error } = verifyToken(token);
        if (error || !payload?.id) {
            throw HttpError(401, "Not authorized");
        }
        const user = await findUser({ id: payload.id });
        if (!user || user.token !== token) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, "Not authorized"));
    }
};

export default authenticate;
