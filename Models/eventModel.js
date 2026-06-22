import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: Date,
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

export const Event = mongoose.model("Event", eventSchema);
