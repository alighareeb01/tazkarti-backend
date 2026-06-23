import express from "express";
import userRouter from "./routes/userRoute.js";
import eventRouter from "./routes/eventRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import { globalErrorHandler } from "./controllers/errController.js";
import { appError } from "./utils/appError.js";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
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
