import startServer from "./app.js";
import initMongodbConnection from "./db/initMongodbConnection.js";

const bootstrap = async () => {
  await initMongodbConnection();
  startServer();
};
bootstrap();
