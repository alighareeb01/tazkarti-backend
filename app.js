import express from "express";
import userRouter from "./routes/userRoute.js";
import eventRouter from "./routes/eventRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import { globalErrorHandler } from "./controllers/errController.js";
import { appError } from "./utils/appError.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: [
    `http://localhost:3000`,
    "http://localhost:5173",
    "https://tazkart-front.vercel.app",
  ],
};

app.use(cors(corsOptions));

// vercel refresh

app.use(express.json({ limit: "10kb" }));

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to the app",
  });
});

app.all("/*splat", (req, res, next) => {
  next(
    new appError(
      `can not find this url : ${req.originalUrl} on this sever`,
      400,
    ),
  );
});

app.use(globalErrorHandler);

export default app;
