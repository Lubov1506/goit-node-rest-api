import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import env from "./utils/env.js";
import { getContacts } from "./services/contactsServices.js";
const startServer = () => {
  const port = Number(env("PORT", 3000));
  const app = express();
  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());

  // app.use("/api/contacts", contactsRouter);
  app.use("/api/contacts", async (req, res) => {
    const data = await getContacts();
    res.json(data);
  });

  app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });

  app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
  });
};
export default startServer;
