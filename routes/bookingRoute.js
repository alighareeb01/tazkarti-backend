import express from "express";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();



router
  .route("/")
  .post(protect, restrictTo("user"), createBooking)
  .get(getMyBookings);
router.route("/:id").delete(protect, restrictTo("user"), cancelBooking);

export default router;
