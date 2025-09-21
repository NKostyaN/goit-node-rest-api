import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("user", {
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter",
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// User.sync();
// User.sync({alter: true});
// User.sync({force: true});

export default User;
