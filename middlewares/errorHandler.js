import { UniqueConstraintError, ValidationError } from "sequelize";

export function errorHandler(err, _req, res, _next) {
    const { status = 500, message = "Internal Server Error" } = err;

    if (err instanceof UniqueConstraintError) {
        return res.status(409).json({ message: "Email in use" });
    }
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: "Validation error" });
    }

    return res.status(status).json({ message });
}
