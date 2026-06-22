import express from "express";
import {
  forgetPassword,
  login,
  signup,
  tryy,
  verifyAccount,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} from "../controllers/authController.js";
import {
  getMe,
  getMyBookings,
  updateMe,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verify-account/:token").get(verifyAccount);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/update-password").patch(protect, updatePassword);

router
  .route("/me")
  .get(protect, restrictTo("user"), getMe)
  .patch(protect, restrictTo("user"), updateMe);
router.route("/my-bookings").get(protect, restrictTo("user"), getMyBookings);

router.route("/try/:id").get(tryy);

export default router;
