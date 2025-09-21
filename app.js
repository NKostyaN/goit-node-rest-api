import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
});
