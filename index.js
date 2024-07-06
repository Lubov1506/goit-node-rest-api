import startServer from "./app";
import initMongodbConnection from "./db/initMongodbConnection";

const bootstrap = async () => {
  await initMongodbConnection();
  startServer();
};
bootstrap();
