const errorHandler = (err, req, res, next) => {
  // Log the error using a logger if needed

  // Get status code from error or default to 500
  const { statusCode = 500, message } = err;

  // Send response with error message
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = { errorHandler };
