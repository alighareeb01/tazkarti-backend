import express from "express";

import userRouter from "./routes/userRoute.js";
import eventRouter from "./routes/eventRoute.js";
import { globalErrorHandler } from "./controllers/errController.js";
import { appError } from "./utils/appError.js";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);

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
