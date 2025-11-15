const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      res.send(userResponse);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};
      delete userResponse.password;
      res.status(200).send(userResponse);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};
const createUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).send(userResponse);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data provided"));
    } else if (err.code === 11000) {
      next(new ConflictError("Email already exists"));
    } else {
      next(err);
    }
  }
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate a token and send it in the response
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
