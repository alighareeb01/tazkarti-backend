import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

if (!process.env.DATABASE) {
  throw new Error("DATABASE env variable is missing");
}

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DATABASE IS CONNECTED");
  })
  .catch((err) => {
    console.log("DATABASE ERROR ", err.message);
  });

mongoose.connection.once("open", () => {
  console.log("CONNETED TO ", mongoose.connection.name);
});

// app.listen(process.env.PORT, () => {
//   console.log(`app running on port ${process.env.PORT}`);
// });

export default app;