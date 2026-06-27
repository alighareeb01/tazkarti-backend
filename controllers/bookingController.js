import { Booking } from "../Models/bookingModel.js";
import { Event } from "../Models/eventModel.js";
import { appError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createBooking = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.body.event);

  if (!event)
    return next(new appError("sorry this event is no longer exist", 404));

  if (event.availableSeats < req.body.seats) {
    return next(
      new appError(`sorry, but there is no available seats to reserve`, 400),
    );
  }

  const alreadyBooked = await Booking.findOne({
    user: req.user.id,
    event: req.body.event,
  });
  if (alreadyBooked)
    return next(new appError("you already booked this event", 400));

  const newBooking = await Booking.create({
    user: req.user.id,
    event: req.body.event,
    seats: req.body.seats,
  });

  await newBooking.populate(["user", "event"]);

  event.availableSeats = event.availableSeats - req.body.seats;
  await event.save();

  res.status(200).json({
    status: "success",
    data: {
      booking: newBooking,
    },
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  if (bookings.length === 0)
    return next(new appError(`you got no bookings`, 404));

  res.status(200).json({
    status: "success",
    bookings,
  });
});

export const cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!booking)
    return next(new appError(`you got no booking for this event`, 404));

  const event = await Event.findById(booking.event);

  event.availableSeats += booking.seats;
  await event.save();
  res.status(200).json({
    status: "success",
    message: "canceled successfully",
  });
});


export const getMostBooking = catchAsync(async (req, res, next) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: "$event",
        totalBookings: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalBookings: -1,
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: "$event",
    },
  ]);

  res.status(200).json({
    status: "success",
    data: stats,
  });
});
