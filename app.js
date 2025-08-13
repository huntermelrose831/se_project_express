const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));
// Middleware to parse JSON bodies
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "6899146841a071c8add293ce", // paste the _id of the test user created in the previous step
  };
  next();
});
// Use the users router for requests to /users
app.use("/", mainRouter);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
