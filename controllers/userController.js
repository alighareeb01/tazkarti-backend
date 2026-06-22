import { Booking } from "../Models/bookingModel.js";
import User from "../Models/userModel.js";
import { appError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new appError(`no such user exist`, 400));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("event");

  if (bookings.length === 0)
    return res.status(200).json({
      status: "success",
      message: "No bookings found",
    });

  res.status(200).json({
    status: "success",
    bookings,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError("you only can update your name", 400));
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    {
      new: true,
    },
  );

  res.status(200).json({ status: "success", updatedUser: user });
});
