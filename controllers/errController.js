import dotenv from "dotenv";
import { appError } from "../utils/appError.js";

dotenv.config({ path: "/config.env" });

function sendErrorDevelopment(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProduction(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "soemthong went wrong!",
    });
  }
}

function handleDuplicateFieldsDB(err) {
  const keyValue = err.keyValue || {};
  const field = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];

  return new appError(
    `Duplicate Data > ${field} : ${value} already exists, please user another values. `,
    400,
  );
}
function handleCastErrorDB(err) {
  return new appError(`Invalid ${err.path} params: ${err.value}`, 400);
}
function handleValidatorErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const msg = `Invalid input fields :${errors.join(", ")}`;
  return new appError(msg, 400);
}

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV.trim() === "development") {
    // console.log(err.name);

    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = err;
    // console.log("here", error);

    // console.log(error.code);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError") error = handleValidatorErrorDB(error);

    sendErrorProduction(error, res);
  }
};
