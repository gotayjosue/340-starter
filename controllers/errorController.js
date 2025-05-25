const causeError = (req, res, next) => {
  const error = new Error("Server Error");
  error.status = 500;
  next(error); // Sends the error to the middleware
}

module.exports = { causeError }