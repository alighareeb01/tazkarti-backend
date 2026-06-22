import express from "express";
import {
  getAllEvents,
  getEvent,
  createEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllEvents)
  .post(protect, restrictTo("admin"), createEvent);

router
  .route("/:id")
  .get(getEvent)
  .delete(protect, restrictTo("admin"), deleteEvent);

export default router;
