import mongoose from "mongoose";

const initMongodbConnection = async () => {
  try {
    const DB_HOST =
      "mongodb+srv://lubaparfyonova:hISB6bG5b5WqjCsS@cluster0.wob74om.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(DB_HOST);
    console.log("successful connection to MongoDB");
  } catch (err) {
    console.log(`Connection error ${err.message}`);
  }
};
export default initMongodbConnection;
