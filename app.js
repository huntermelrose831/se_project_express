const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

require("dotenv").config();

const app = express();
const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
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

// enable error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
