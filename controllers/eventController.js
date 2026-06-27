import multer from "multer";
import { Event } from "../Models/eventModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import path from "path";
import { fileURLToPath } from "url";
import { appError } from "../utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// multer
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/imgs"));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("please upload an image", 401), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPhoto = upload.single("image");
export const createEvent = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const newEventObj = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    price: req.body.price,
    availableSeats: req.body.availableSeats,
    category: req.body.category,
    location: req.body.location,
  };
  if (req.file) {
    newEventObj.image = req.file.filename;
  }

  const newEvent = await Event.create(newEventObj);
  // console.log(req.file);

  res.status(200).json({ status: "success", newEvent });
});

export const deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
