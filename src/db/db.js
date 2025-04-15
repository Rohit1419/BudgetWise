import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_Name}`);
    console.log(`\n MongoDB connected : ${mongoose.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
  }
};

export default dbConnect;
