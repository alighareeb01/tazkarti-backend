import express from "express";
import {
  getAllEvents,
  getEvent,
  createEvent,
  deleteEvent,
  uploadPhoto,
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllEvents)
  .post(protect, restrictTo("admin"), uploadPhoto, createEvent);

router
  .route("/:id")
  .get(getEvent)
  .delete(protect, restrictTo("admin"), deleteEvent);

export default router;
