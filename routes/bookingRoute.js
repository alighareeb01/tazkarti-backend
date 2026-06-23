import express from "express";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect, restrictTo("user"));

router.route("/").post(createBooking).get(getMyBookings);
router.route("/:id").delete(cancelBooking);

export default router;
