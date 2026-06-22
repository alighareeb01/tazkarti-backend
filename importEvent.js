import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "./Models/eventModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const events = JSON.parse(fs.readFileSync("eventSample.json", "utf-8"));

dotenv.config({ path: "./config.env" });
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

const importData = async () => {
  await Event.create(events);
  console.log("data succesfully loaded");
  process.exit();
};

const deleteData = async () => {
  await Event.deleteMany();
  console.log("deleted successfully");
  process.exit();
};

if (process.argv[2] === "--delete") {
  deleteData();
}
if (process.argv[2] === "--import") {
  importData();
}
