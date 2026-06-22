import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "notBooked"],
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
