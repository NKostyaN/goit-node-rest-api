import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Contact = sequelize.define("contact", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// Contact.sync();
// Contact.sync({alter: true});
// Contact.sync({force: true});

export default Contact;
