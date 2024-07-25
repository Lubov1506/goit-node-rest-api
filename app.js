import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import env from "./utils/env.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/userRouter.js";
import path from "node:path";
const startServer = () => {
  const port = Number(env("PORT", 3000));
  const app = express();
  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());

  app.use(express.static(path.resolve("public")));
  app.use("/api/users", userRouter);
  app.use("/api/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
  });
};
export default startServer;
