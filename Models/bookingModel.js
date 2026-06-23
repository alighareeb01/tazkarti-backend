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
  seats: {
    type: Number,
    required: true,
    min: 1,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate("event");
  next();
});


export const Booking = mongoose.model("Booking", bookingSchema);
