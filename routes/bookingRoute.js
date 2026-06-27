import express from "express";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
  getMostBooking,
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// asd
router
  .route("/")
  .post(protect, restrictTo("user"), createBooking)
  .get(getMyBookings);
router.route("/:id").delete(protect, restrictTo("user"), cancelBooking);

router.route("/most-bookings").get(getMostBooking);

export default router;
