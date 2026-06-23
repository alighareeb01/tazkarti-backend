import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import { appError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { client } from "../redisConnection.js";
dotenv.config({ path: "./config.env" });

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    nationality: req.body.nationality,
    city: req.body.city,
    datOfBirth: req.body.datOfBirth,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  //sendEmail
  const verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Verify your account",
      message: `
  <h2>Verify your account</h2>
  <p>Click the link below:</p>
  <a href="${req.protocol}://${req.get("host")}/api/users/verify-account/${verifyToken}">
    Verify Account
  </a>
`,
    });
  } catch (error) {
    console.log("error from Email", error);
  }

  res.status(201).json({
    status: "success",
    message: "PLEASE VERIFY YOUR ACCOUNT SO YOU CAN LOGIN",
    data: {
      newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new appError(`please enter email or password`, 401));

  const user = await User.findOne({ email }).select("+password");

  if (!user.isVerified)
    return next(
      new appError(`please verify your account so you can log in`, 400),
    );

  if (!user || !(await user.comparePassowrds(password, user.password))) {
    return next(new appError(`Incorrect email or password`, 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  user.password = undefined;

  res.json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

export const verifyAccount = catchAsync(async (req, res, next) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new appError("User not found", 404));
  }

  if (user.isVerified)
    return res.status(200).json({
      message: "Already verfifed , please login",
    });

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "your acoount is verified successfully",
  });
});

export const tryy = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new appError("asd", 500));
  }

  res.json({
    user,
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new appError(`there is noe user with this email address`, 400));

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHashed = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await client.set(`passwordResetToken:${tokenHashed}`, `${user._id}`, {
    EX: 60 * 10,
  });
  await user.save();

  await sendEmail({
    email: user.email,
    subject: "your reset token",
    message: `Please go to :
    
     <${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}> TO RESET YOUR PASSWORD
    `,
  });

  res.status(200).json({
    status: "success",
    mesage: " token sent to your email",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const tokenHashed = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const userId = await client.get(`passwordResetToken:${tokenHashed}`);

  if (!userId) {
    return next(new appError("Invalid or expired token", 400));
  }

  const user = await User.findById(userId);

  if (!user) return next(new appError("User not found", 404));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({
    status: "success",
    mesage: " password is reset successfully",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassowrds(req.body.currentPassword, user.password))) {
    return next(new appError("your current password is wrong", 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  user.password = undefined;

  res.json({
    status: "success",
    token,
    message: "password upadted",
    data: {
      user,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new appError(
        "you are not logged in ,please login again to get access",
        401,
      ),
    );
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(
      new appError("the user belonging to this token no longer exist", 401),
    );
  }

  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (decode.iat < changedTimestamp) {
      return next(new appError("Password changed. Please log in again.", 401));
    }
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError(`you dont have permission for this action`, 403),
      );
    }
    next();
  };
};
