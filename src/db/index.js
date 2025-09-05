import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const DBInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`mobgodb connected Host Name: ${DBInstance.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed. error", error);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//   } catch (error) {
//     console.log("error", error);
//     process.exit(1);
//   }
// })();
