import mongoose from "mongoose";
const connnetMongoDb = async (url) => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`Db connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error : ${err.message}`);
    process.exit(1);
  }
};
export default connnetMongoDb;
