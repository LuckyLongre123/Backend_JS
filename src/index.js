import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;
const Backend_Uri = process.env.BACKEND_URI || "http//localhost:";

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`Server is running on: ${Backend_Uri}${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed: ", err);
  });
