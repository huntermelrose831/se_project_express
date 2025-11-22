require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const mainRouter = require("./routes/index");

const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./utils/errors/NotFoundError");

const app = express();
const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // database successfully connected
  })
  .catch((e) => {
    throw new Error(`Database connection failed: ${e.message}`);
  });

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://api.whattowearproject.jumpingcrab.com",
  "https://whattowearproject.jumpingcrab.com",
  "https://www.whattowearproject.jumpingcrab.com",
];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// enable request logger
app.use(requestLogger);

// Crash test endpoint - REMOVE AFTER CODE REVIEW
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);

// 404 handler for non-existent routes
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// enable error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  // server started
});
