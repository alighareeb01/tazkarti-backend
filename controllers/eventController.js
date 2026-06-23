import { Event } from "../Models/eventModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllEvents = catchAsync(async (req, res, next) => {
  let queryObj = { ...req.query };
  const excludedFields = ["sort", "page", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  queryObj = JSON.parse(queryString);

  let query = Event.find(queryObj);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const events = await query;

  if (events.length === 0)
    return res.status(404).json({
      message: "not events found",
    });

  res.status(200).json({
    status: "success",
    results: events.length,
    events,
  });
});

export const getEvent = catchAsync(async (req, res, next) => {
  // console.log(req.params);

  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(400).json({
      message: "not events found",
    });

  res.status(200).json({
    status: "success",

    event,
  });
});

export const createEvent = catchAsync(async (req, res, next) => {
  const newEvent = await Event.create({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    price: req.body.price,
    availableSeats: req.body.availableSeats,
    category: req.body.category,
    location: req.body.location,
  });

  res.status(200).json({ status: "success", newEvent });
});

export const deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
