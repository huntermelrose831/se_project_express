const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const app = express();

const { PORT = 3001 } = process.env;


// Middleware to parse JSON bodies
app.use(express.json());

// Use the users router for requests to /users
app.use('/users', userRouter);


app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(() => {
  console.log("Connected to DB");
}).catch((e) => console.error(e));